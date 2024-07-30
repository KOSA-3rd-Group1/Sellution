package shop.sellution.server.event.application;

import lombok.RequiredArgsConstructor;
import lombok.Synchronized;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.connection.ReturnType;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.event.domain.*;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.dto.request.SaveEventReq;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.event.dto.response.FindEventRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_USER;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final EventRepositoryCustom eventRepositoryCustom;
    private final CompanyRepository companyRepository;
    private final CouponBoxRepository couponBoxRepository;
    private final CustomerRepository customerRepository;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional(readOnly = true)
    @Override
    public Page<FindEventRes> findAllEvents(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long companyId = userDetails.getCompanyId();
        Company company = getCompanyById(companyId);
        // 필터링 x
        if(startDate == null && endDate == null){
            return eventRepository.findAllByCompanyCompanyIdAndIsDeletedFalse(companyId, pageable)
                    .map(FindEventRes::fromEntity);
        }
        // 필터링 o
        return eventRepositoryCustom.findEventsByCompanyAndDate(company, startDate, endDate, pageable)
                .map(FindEventRes::fromEntity);

    }
    //이벤트 생성
    @Override
    public void saveEvent(SaveEventReq saveEventReq) {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long companyId = userDetails.getCompanyId();
        //Long companyId = 1L;
        //당일은 startdate가 불가능하게
        LocalDate now = LocalDate.now();
        LocalDate tomorrow = now.plusDays(1);
        if(saveEventReq.getEventStartDate().isBefore(tomorrow)){
            throw new IllegalArgumentException("이벤트 시작일은 다음날부터 설정 가능합니다.");
        }
        if(saveEventReq.getEventEndDate().isBefore(tomorrow)){
            throw new IllegalArgumentException("이벤트 종료일 설정이 잘못되었습니다.");
        }
        Company company = getCompanyById(companyId);
        CouponEvent event = saveEventReq.toEntity(company);
        eventRepository.save(event);
        //redis
        String key = "event:" + event.getId();
        try {
            // Redis에 초기 set 생성 및 TTL 설정
            redisTemplate.delete(key);  // 기존 키 삭제 (다시 create 할 때 중복 방지)
            redisTemplate.opsForSet().add(key, "INIT");  // 빈 set 생성 + TTL 설정 위한 더미데이터 추가
            redisTemplate.expireAt(key, Date.valueOf(event.getEventEndDate().plusDays(1))); // 종료일 자정으로 TTL 설정
        } catch (Exception e) {
            // Redis 설정 중 예외 발생 시 RDB 트랜잭션 롤백
            eventRepository.delete(event);
            throw new RuntimeException("Redis 설정 중 오류가 발생했습니다. 이벤트 생성이 취소되었습니다.", e);
        }
    }

    @Override
    public void updateEvent(Long eventId, UpdateEventReq updateEventReq) {
        CouponEvent event = getEventById(eventId);
        //이벤트는 이름 수정과 종료일 연장만 가능
        if(updateEventReq.getEventEndDate().isBefore(event.getEventEndDate())){
            throw new IllegalArgumentException("이벤트 종료일은 이전 종료일보다 늦어야 합니다."); //잘못된 인수 오류
        }
        //종료일이 지난 이벤트는 수정불가
        if(event.getState()== EventState.END){
            throw new IllegalArgumentException("종료된 이벤트는 수정할 수 없습니다.");
        }
        event.update(updateEventReq);
//        eventRepository.save(event); 엔티티 변경사항은 트랜잭션이 끝날 때 자동으로 반영

        // Redis TTL 갱신
        String key = "event:" + event.getId();
        try {
            redisTemplate.expireAt(key, Date.valueOf(updateEventReq.getEventEndDate().plusDays(1)));
        } catch (Exception e) {
            throw new RuntimeException("Redis TTL 설정 중 오류가 발생했습니다. 이벤트 업데이트가 취소되었습니다.", e);
        }
    }

    @Override
    public void deleteEvent(Long eventId) {
        //삭제로직
        //1. upcoming,end 이벤트는 isDeleted = true
        //2. ongoing 이벤트는 삭제불가 오류 발생
        CouponEvent event = getEventById(eventId);
        LocalDate now = LocalDate.now();
        if(now.isAfter(event.getEventStartDate())|| event.getEventEndDate().isBefore(now.plusDays(1))){
            throw new IllegalArgumentException("진행중인 이벤트는 삭제할 수 없습니다.");
        }
        event.markAsDeleted();
        eventRepository.save(event); //없어도 됨
        //redis는 삭제
        String key = "event:" + event.getId();
        redisTemplate.delete(key); // 키 삭제
    }

    @Transactional(readOnly = true)
    @Override
    public List<FindEventRes> findAllOngoingEvents(Long companyId) {
        //isDeleted가 false이고, 오늘 날짜가 이벤트 시작일과 종료일 사이에 있는 이벤트 조회
        LocalDate now = LocalDate.now();
        Company company = getCompanyById(companyId);
        return eventRepositoryCustom.findAllOngoingEvents(company, now)
                .stream()
                .map(FindEventRes::fromEntity)
                .toList();
    }

    @Override
    public Page<FindEventRes> findCoupons(Pageable pageable) {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long customerId = userDetails.getUserId();
        //event 종료기간이 지나지 않고 isUsed가 N인 쿠폰
        LocalDate now = LocalDate.now();
        return eventRepositoryCustom.findCouponsByCustomer(customerId, now, pageable)
                .map(FindEventRes::fromEntity);
    }
    //쿠폰 다운로드
    @Override
    public void saveCoupon(Long eventId) {//Transactional으로 묶어서 RDB연산 보장
        //1. rdb 트랜잭션 시작
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long customerId = userDetails.getUserId();
        LocalDate now = LocalDate.now();
        CouponEvent event = getEventById(eventId);

        //2. 유효성 검증
        validateEvent(now, event, customerId);

        //3. 쿠폰 발급량 증가 API 호출
        boolean success = tryIncreaseCouponCount(eventId, event.getTotalQuantity(), customerId);
        if(!success){
            throw new IllegalArgumentException("쿠폰이 모두 소진되었습니다.");
        }
        //4. 발급 가능한 경우 쿠폰 생성(rdb save)
        try{
            CouponBox couponBox = CouponBox.builder()
                    .id(new CouponBoxId(customerId, eventId))
                    .couponEvent(event)
                    .customer(getCustomerById(customerId))
                    .build();
            couponBoxRepository.save(couponBox);
        }catch(Exception e){
            //redis 롤백
            rollbackCouponCount(eventId, customerId);
            throw new RuntimeException("쿠폰 발급 중 오류가 발생했습니다. 트랜잭션이 롤백됩니다.", e);
        }

        //5. 트랜잭션 commit (rdb)
    }

    //쿠폰 발급량 증가 API
    private boolean tryIncreaseCouponCount(Long eventId, int totalQuantity, Long customerId){
        //1. 현재 발급 가능한 상태인지 쿠폰 유효성 검증 (개수를 확인하는 연산 SCARD)
        //2. 발급 가능한 경우 발급량 증가(redis) (set에 값을 추가하는 연산 SADD)
        //=> 1,2은 redis 트랜잭션
        String key = "event:" + eventId;
        String customerKey = customerId.toString();

        String script =
                "local currentCount = redis.call('SCARD', KEYS[1]) - 1 " + // currentCount에서 더미수량 1을 뺌
                        "if tonumber(currentCount) < tonumber(ARGV[1]) then " +
                        "   redis.call('SADD', KEYS[1], ARGV[2]) " +
                        "   return 1 " +
                        "else " +
                        "   return 0 " +
                        "end";

        return Boolean.TRUE.equals(redisTemplate.execute((RedisCallback<Boolean>) connection -> {
            Object result = connection.eval(
                    script.getBytes(),
                    ReturnType.INTEGER,
                    1,
                    key.getBytes(), //KEYS[1]
                    String.valueOf(totalQuantity).getBytes(), // ARGV[1]
                    customerKey.getBytes()  // ARGV[2]
            );
            return result != null && (Long) result == 1;
        }));
    }
    //쿠폰 발급량 감소 API
    private void rollbackCouponCount(Long eventId, Long customerId) {
        String key = "event:" + eventId;
        String customerKey = customerId.toString();

        redisTemplate.opsForSet().remove(key, customerKey);
    }
    //쿠폰 다운로드 유효성 검증
    private void validateEvent(LocalDate now, CouponEvent event, Long customerId){
        //1. 해당 이벤트가 종료되었는지 확인
        //2. 해당 이벤트가 삭제되었는지 확인
        //3. 사용자가 이미 발급했는지 확인
        if(now.isAfter(event.getEventEndDate()) || now.isBefore(event.getEventStartDate())){
            throw new IllegalArgumentException("이벤트 기간이 아닙니다");
        }
        if(event.isDeleted()){
            throw new IllegalArgumentException("중단된 이벤트는 쿠폰을 다운로드할 수 없습니다.");
        }
        //TODO: (redis로도 확인 가능)
        if(couponBoxRepository.existsByCustomerIdAndCouponEventId(customerId, event.getId())){
            throw new IllegalArgumentException("이미 쿠폰을 다운로드하셨습니다.");
        }
    }
    //쿠폰 다운로드 (동시성 테스트)
//    @Override
//    public void downloadCoupon(Long customerId, Long eventId) {
//        //쿠폰 다운로드 로직
//        //1. 해당 이벤트가 종료되었는지 확인
//        //2. 해당 이벤트가 삭제되었는지 확인
//        //3. 해당 이벤트가 이미 다운로드 되었는지 확인
//        //4. 쿠폰 다운로드
//        LocalDate now = LocalDate.now();
//        CouponEvent event = getEventById(eventId);
//        if(now.isAfter(event.getEventEndDate()) || now.isBefore(event.getEventStartDate())){
//            throw new IllegalArgumentException("이벤트 기간이 아닙니다");
//        }
//        if(event.isDeleted()){
//            throw new IllegalArgumentException("중단된 이벤트는 쿠폰을 다운로드할 수 없습니다.");
//        }
//
//        if(couponBoxRepository.existsByCustomerIdAndCouponEventId(customerId, eventId)){
//            throw new IllegalArgumentException("이미 쿠폰을 다운로드하셨습니다.");
//        }
//        //Redis를 사용하여 쿠폰 개수 확인 & 감소
//        //event.decreaseRemainingQuantity(); // 남은 쿠폰 수량 감소
//        if(!event.getInitialQuantity().equals(Integer.MAX_VALUE)){
//            Long remainingQuantity = couponCountRepository.decrement(eventId);
//            if(remainingQuantity < 0){
//                throw new IllegalArgumentException("쿠폰이 모두 소진되었습니다.");
//            }
//        }
//
//        //발급 가능한 경우 쿠폰 생성
//        CouponBox couponBox = CouponBox.builder()
//                .id(new CouponBoxId(customerId, eventId))
//                .couponEvent(event)
//                .customer(getCustomerById(customerId))
//                .build();
//        couponBoxRepository.save(couponBox);
//    }

    //예외처리 추가한 메서드
    private Company getCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
    }

    private CouponEvent getEventById(Long eventId) {
        return eventRepository.findByIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_EVENT));
    }

    private Customer getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CUSTOMER));
    }

    private CustomUserDetails getCustomUserDetailsFromSecurityContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("principal >>>>> " + principal);
        if (principal instanceof CustomUserDetails) {
            return (CustomUserDetails) principal;
        } else {
            throw new AuthException(NOT_FOUND_USER);
        }
    }
    @Override
    public void createDummyEvent(SaveEventReq saveEventReq) {
        Long companyId = 1L;
        //유효성 조건 없이 더미 데이터 생성
        Company company = getCompanyById(companyId);
        CouponEvent event = saveEventReq.toEntity(company);
        eventRepository.save(event);
        //redis
        String key = "event:" + event.getId();
        try {
            // Redis에 초기 set 생성 및 TTL 설정
            redisTemplate.delete(key);  // 기존 키 삭제 (다시 create 할 때 중복 방지)
            redisTemplate.opsForSet().add(key, "INIT");  // 빈 set 생성 + TTL 설정 위한 더미데이터 추가
            redisTemplate.expireAt(key, Date.valueOf(event.getEventEndDate().plusDays(1))); // 종료일 자정으로 TTL 설정
        } catch (Exception e) {
            // Redis 설정 중 예외 발생 시 RDB 트랜잭션 롤백
            eventRepository.delete(event);
            throw new RuntimeException("Redis 설정 중 오류가 발생했습니다. 이벤트 생성이 취소되었습니다.", e);
        }
    }

}




