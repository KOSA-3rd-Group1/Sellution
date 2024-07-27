package shop.sellution.server.event.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_USER;

@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final EventRepositoryCustom eventRepositoryCustom;
    private final CompanyRepository companyRepository;
    private final CouponBoxRepository couponBoxRepository;
    private final CustomerRepository customerRepository;

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

    @Override
    public void saveEvent(SaveEventReq saveEventReq) {
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long companyId = userDetails.getCompanyId();
        //당일은 startdate가 불가능하게
        LocalDate now = LocalDate.now();
        LocalDate tomorrow = now.plusDays(1);
        if(saveEventReq.getEventStartDate().isBefore(tomorrow)){
            throw new IllegalArgumentException("이벤트 시작일은 다음날부터 설정 가능합니다.");
        }
        Company company = getCompanyById(companyId);
        CouponEvent event = saveEventReq.toEntity(company);
        eventRepository.save(event);
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

    @Override
    public void saveCoupon(Long eventId) {
        //쿠폰 다운로드 로직
        //1. 해당 이벤트가 종료되었는지 확인
        //2. 해당 이벤트가 삭제되었는지 확인
        //3. 해당 이벤트가 이미 다운로드 되었는지 확인
        //4. 쿠폰 다운로드
        CustomUserDetails userDetails = getCustomUserDetailsFromSecurityContext();
        Long customerId = userDetails.getUserId();
        System.out.println("customerId >>>>> " + customerId);
        LocalDate now = LocalDate.now();
        CouponEvent event = getEventById(eventId);
        if(now.isAfter(event.getEventEndDate()) || now.isBefore(event.getEventStartDate())){
            throw new IllegalArgumentException("이벤트 기간이 아닙니다");
        }
        if(event.isDeleted()){
            throw new IllegalArgumentException("중단된 이벤트는 쿠폰을 다운로드할 수 없습니다.");
        }
        if(couponBoxRepository.existsByCustomerIdAndCouponEventId(customerId, eventId)){
            throw new IllegalArgumentException("이미 쿠폰을 다운로드하셨습니다.");
        }
        CouponBox couponBox = CouponBox.builder()
                .id(new CouponBoxId(customerId, eventId))
                .couponEvent(event)
                .customer(getCustomerById(customerId))
                .build();
        couponBoxRepository.save(couponBox);
    }

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
}




