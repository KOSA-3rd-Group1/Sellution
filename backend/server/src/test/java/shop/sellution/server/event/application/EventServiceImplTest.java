//package shop.sellution.server.event.application;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.test.util.ReflectionTestUtils;
//import org.springframework.transaction.annotation.Transactional;
//import shop.sellution.server.company.domain.Company;
//import shop.sellution.server.company.domain.CompanyImage;
//import shop.sellution.server.company.domain.repository.CompanyRepository;
//import shop.sellution.server.company.domain.type.ImagePurposeType;
//import shop.sellution.server.company.domain.type.SellType;
//import shop.sellution.server.company.domain.type.SubscriptionType;
//import shop.sellution.server.customer.domain.Customer;
//import shop.sellution.server.customer.domain.CustomerRepository;
//import shop.sellution.server.customer.domain.type.CustomerType;
//import shop.sellution.server.event.application.EventServiceImpl;
//import shop.sellution.server.event.domain.CouponBoxRepository;
//import shop.sellution.server.event.domain.CouponEvent;
//import shop.sellution.server.event.domain.EventRepository;
//import shop.sellution.server.event.domain.type.EventState;
//import shop.sellution.server.event.domain.type.TargetCustomerType;
//import shop.sellution.server.global.type.DeliveryType;
//import shop.sellution.server.global.type.DisplayStatus;
//
//import java.sql.Date;
//import java.time.LocalDate;
//import java.util.concurrent.CountDownLatch;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//
//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
//@SpringBootTest
//class EventServiceImplTest {
//    @Autowired
//    private EventServiceImpl eventServiceImpl;
//    @Autowired
//    EventRepository eventRepository;
//    @Autowired
//    CouponBoxRepository couponBoxRepository;
//    @Autowired
//    CompanyRepository companyRepository; // 추가 필요
//    @Autowired
//    CustomerRepository customerRepository; // 추가 필요
//    @Autowired
//    RedisTemplate<String, String> redisTemplate;
//
//
//    @BeforeEach
//    public void setup() {
//        Company company = Company.builder()
//                .companyId(1L)
//                .displayName("Pocket Salad")
//                .name("PocketSalad")
//                .shopUrl("https://sellution/shopping/pocketsalad")
//                .isShopVisible(DisplayStatus.Y)
//                .isAutoApproved(DisplayStatus.N)
//                .isNewMemberEvent(DisplayStatus.N)
//                .serviceType(DeliveryType.BOTH)
//                .subscriptionType(SubscriptionType.MONTH)
//                .minDeliveryCount(5)
//                .maxDeliveryCount(30)
//                .themeColor("F37021")
//                .sellType(SellType.ALL)
//                .mainPromotion1Title("한끼, 건강하고 간단하게")
//                .mainPromotion1Content("최고의 퀄리티를 위해\n아끼지 않고 가득 담았습니다.")
//                .mainPromotion2Title("식단 관리 할 사람!")
//                .mainPromotion2Content("너랑!  나랑!")
//                .build();
//        companyRepository.save(company);
//
//
//        CouponEvent couponEvent = CouponEvent.builder()
//                .company(company)
//                .couponName("Test Coupon")
//                .couponDiscountRate(10)
//                .targetCustomerType(TargetCustomerType.ALL)
//                .eventStartDate(LocalDate.now())
//                .eventEndDate(LocalDate.now().plusDays(10))
//                .totalQuantity(100)
//                .isDeleted(false)
//                .state(EventState.ONGOING) // 명시적으로 상태 설정
//                .build();
//        ReflectionTestUtils.setField(couponEvent, "id", 1L);
//        eventRepository.save(couponEvent); // 저장
//        String key = "event:" + couponEvent.getId();
//        try {
//            // Redis에 초기 set 생성 및 TTL 설정
//            redisTemplate.delete(key);  // 기존 키 삭제 (다시 create 할 때 중복 방지)
//            redisTemplate.opsForSet().add(key, "INIT");  // 빈 set 생성 + TTL 설정 위한 더미데이터 추가
//        } catch (Exception e) {
//            // Redis 설정 중 예외 발생 시 RDB 트랜잭션 롤백
//            eventRepository.delete(couponEvent);
//            throw new RuntimeException("Redis 설정 중 오류가 발생했습니다. 이벤트 생성이 취소되었습니다.", e);
//        }
//
//        for (int i = 1; i <= 1000; i++) {
//            Customer customer = Customer.builder()
//                    .company(company)
//                    .username("newCustomer")
//                    .password("newCustomer")
//                    .name("길재현" + i)
//                    .phoneNumber("01075985112")
//                    .type(CustomerType.NEW)
//                    .build();
//
//            ReflectionTestUtils.setField(customer, "id", (long) i); // Long 타입으로 설정
//
//            customerRepository.save(customer); // 저장
//        }
//
//        // Redis 카운터 초기화
//        redisTemplate.delete("event:" + couponEvent.getId());
//    }
//
//    @DisplayName("쿠폰 다운로드 한번 성공 테스트")
//    @Test
//    @Transactional
//    @Rollback
//    void 하나만_다운로드() {
//        //given
//        Company company = companyRepository.findById(1L).get();
//
//        Customer customer = Customer.builder()
//                .company(company)
//                .username("newCustomer")
//                .password("newCustomer")
//                .name("길재현")
//                .phoneNumber("01075985112")
//                .type(CustomerType.NEW)
//                .build();
//
//        customerRepository.save(customer); // 저장
//
//        //when
//        eventServiceImpl.downloadCoupon(1L, 1L);
//
//        long count = couponBoxRepository.countByCouponEvent_Id(1L);
//        assertThat(count).isEqualTo(1);
//    }
//
//    @DisplayName("쿠폰 다운로드 여러명 성공 테스트")
//    @Test
//    void 여러명_다운로드() throws InterruptedException {
//        Company company = companyRepository.findById(1L).get();
//
//        int threadCount = 1000;
//        ExecutorService executorService = Executors.newFixedThreadPool(100);
//        CountDownLatch countDownLatch = new CountDownLatch(threadCount);    //다른 스레드에서 사용하는 작업 기다리게 해줌
//
//        for(int i = 1; i <= threadCount; i++){
//            long customerId = i;
//            executorService.submit(() -> {
//                try {   //threadCount만큼의 요청 보내기
//                    eventServiceImpl.downloadCoupon(1L, customerId);
//                } catch (Exception e) {
//                    System.err.println("Exception occurred for customer ID " + customerId + ": " + 1L);
//                } finally {
//                    countDownLatch.countDown();
//                }
//            });
//        }
//
//        countDownLatch.await();
//        //모든 요청이 완료되면 생성된 쿠폰의 개수 확인
//        long count = couponBoxRepository.countByCouponEvent_Id(1L);
//        System.out.println("couponEvent 발급 수량: " + count);
//        assertThat(count).isEqualTo(eventRepository.findById(1L).get().getTotalQuantity());
//    }
//
//    @DisplayName("쿠폰 다운로드 동시성 성공 테스트")
//    @Test
//    void downloadCoupon2() throws InterruptedException {
//        Company company = companyRepository.findById(1L).get();
//
//        int threadCount = 1000;
//        ExecutorService executorService = Executors.newFixedThreadPool(32);
//        CountDownLatch countDownLatch = new CountDownLatch(threadCount);
//
//        for (int i = 1; i <= threadCount ; i++) {
//            long customerId = i;
//            executorService.submit(() -> {
//                try {
//                    eventServiceImpl.downloadCoupon2(1L, customerId);
//                    //다운로드 과정에서
//                } catch (Exception e) {
//                    System.err.println("Exception occurred for customer ID " + customerId + ": " + 1L);
//                } finally {
//                    countDownLatch.countDown();
//                }
//            });
//        }
//        countDownLatch.await();
//        //모든 요청이 완료되면 생성된 쿠폰의 개수 확인
//        int count = (int) couponBoxRepository.countByCouponEvent_Id(1L);
//        System.out.println("couponEvent 발급 수량: " + count);
//        assertThat(count).isEqualTo(eventRepository.findById(1L).get().getTotalQuantity());
//    }
//
//    @Test
//    void downloadCoupon3() throws InterruptedException {
//        int threadCount = 1000;
//        ExecutorService executorService = Executors.newFixedThreadPool(100);
//        CountDownLatch countDownLatch = new CountDownLatch(threadCount);
//
//        for (int i = 1; i <= threadCount ; i++) {
//            long customerId = i;
//            executorService.submit(() -> {
//                try {
//                    eventServiceImpl.downloadCoupon3(1L, customerId);
//                } catch (Exception e) {
//                    System.err.println("Exception occurred for customer ID " + customerId + ": " + 1L);
//                } finally {
//                    countDownLatch.countDown();
//                }
//            });
//        }
//
//        countDownLatch.await();
//        //모든 요청이 완료되면 생성된 쿠폰의 개수 확인
//        int count = (int) couponBoxRepository.countByCouponEvent_Id(1L);
//        System.out.println("couponEvent 발급 수량: " + count);
//        assertThat(count).isEqualTo(eventRepository.findById(1L).get().getTotalQuantity());
//    }
//}
