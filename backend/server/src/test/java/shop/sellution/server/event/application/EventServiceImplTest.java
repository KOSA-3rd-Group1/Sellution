package shop.sellution.server.event.application;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.event.domain.*;
import shop.sellution.server.event.domain.type.TargetCustomerType;

import java.time.LocalDate;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {
    @Mock
    private EventRepository eventRepository;

    @Mock
    private CouponBoxRepository couponBoxRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CouponCountRepository couponCountRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations; //redis 서버와의 통신 없이 단위 테스트 수행 가능

    @InjectMocks
    private EventServiceImpl eventServiceImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations); //redisTemplate 객체의 opsForValue() 메서드가 호출될 때 valueOperations 객체 반환
        //redis에서 값을 설정하거나 가져올 때 사용할 valueOperations 인터페의 mock 객체를 설정하는 부분
    }

//    @DisplayName("쿠폰 다운로드 한번 성공 테스트")
//    @Test
//    void 한번만_다운로드() {
//        //Given
//        Company company = Company.builder().build();
//        ReflectionTestUtils.setField(company, "companyId", 1L);
//
//        Customer customer = Customer.builder().build();
//        ReflectionTestUtils.setField(customer, "id", 1L);
//
//        CouponEvent couponEvent = CouponEvent.builder()
//                .company(company)
//                .couponName("Test Coupon")
//                .couponDiscountRate(10)
//                .targetCustomerType(TargetCustomerType.ALL)
//                .eventStartDate(LocalDate.now())
//                .eventEndDate(LocalDate.now().plusDays(10))
//                .initialQuantity(100)
//                .remainingQuantity(100)
//                .isDeleted(false)
//                .build();
//
//        ReflectionTestUtils.setField(couponEvent, "id", 1L);
//
//        // Mock 설정
//        when(eventRepository.findByIdAndIsDeletedFalse(couponEvent.getId())).thenReturn(Optional.of(couponEvent));
//        when(couponBoxRepository.existsByCustomerIdAndCouponEventId(customer.getId(), couponEvent.getId())).thenReturn(false);
//        when(customerRepository.findById(customer.getId())).thenReturn(Optional.of(customer));
//        when(couponBoxRepository.save(any(CouponBox.class))).thenAnswer(invocation -> invocation.getArgument(0)); //저장된 객체 반환
//
//        // When
//        eventServiceImpl.downloadCoupon(customer.getId(), couponEvent.getId());
//
//        // Then
//        assertEquals(99, couponEvent.getRemainingQuantity());
//        verify(couponBoxRepository, times(1)).save(any(CouponBox.class));
//    }

//    @DisplayName("동시에 여러개의 요청")
//    @Test
//    void 동시에여러명_다운로드() throws InterruptedException {
//        // Given
//        Company company = Company.builder().build();
//        ReflectionTestUtils.setField(company, "companyId", 1L);
//
//        CouponEvent couponEvent = CouponEvent.builder()
//                .company(company)
//                .couponName("Test Coupon")
//                .couponDiscountRate(10)
//                .targetCustomerType(TargetCustomerType.ALL)
//                .eventStartDate(LocalDate.now())
//                .eventEndDate(LocalDate.now().plusDays(10))
//                .initialQuantity(100)
//                .remainingQuantity(100)
//                .isDeleted(false)
//                .build();
//
//        ReflectionTestUtils.setField(couponEvent, "id", 1L);
//
//        // Mock 설정
//        lenient().when(eventRepository.findByIdAndIsDeletedFalse(couponEvent.getId())).thenReturn(Optional.of(couponEvent));
//
//        int threadCount = 100;
//        ExecutorService executorService = Executors.newFixedThreadPool(32); // 병렬 작업 간단히 하게 도와주는 자바 api
//        CountDownLatch latch = new CountDownLatch(threadCount); // 다른 스레드에서 진행하는 작업 기다림
//
//        for (int i = 0; i < threadCount; i++) {
//            // 1000개의 요청
//            Customer customer = Customer.builder().build();
//            ReflectionTestUtils.setField(customer, "id", (long) i); // Long 타입으로 설정
//
//            // Mock 설정
//            lenient().when(customerRepository.findById(customer.getId())).thenReturn(Optional.of(customer));
//            lenient().when(couponBoxRepository.existsByCustomerIdAndCouponEventId(customer.getId(), couponEvent.getId())).thenReturn(false);
//            lenient().when(couponBoxRepository.save(any(CouponBox.class))).thenAnswer(invocation -> invocation.getArgument(0));
//
//            // When
//            executorService.submit(() -> {
//                try {
//                    eventServiceImpl.downloadCoupon(customer.getId(), couponEvent.getId());
//                } finally {
//                    latch.countDown();
//                }
//            });
//        }
//        latch.await(); // 모든 스레드가 끝날 때까지 대기
//        executorService.shutdown();
//
//        // Then
//        System.out.println("남은 수량: " + couponEvent.getRemainingQuantity());
//        //assertNotEquals(0, couponEvent.getRemainingQuantity(), "동시성 문제로 인해 남은 수량이 0이 아닐 수 있음");
//        assertThat(couponEvent.getRemainingQuantity()).isEqualTo(0);
//        //verify(couponBoxRepository, times(threadCount)).save(any(CouponBox.class));
//    }
    @DisplayName("동시에 여러개의 요청")
    @Test
    void 동시에여러명_다운로드() throws InterruptedException {
        // Given
        Company company = Company.builder().build();
        ReflectionTestUtils.setField(company, "companyId", 1L);

        CouponEvent couponEvent = CouponEvent.builder()
                .company(company)
                .couponName("Test Coupon")
                .couponDiscountRate(10)
                .targetCustomerType(TargetCustomerType.ALL)
                .eventStartDate(LocalDate.now())
                .eventEndDate(LocalDate.now().plusDays(10))
                .initialQuantity(100)
                .isDeleted(false)
                .build();

        ReflectionTestUtils.setField(couponEvent, "id", 1L);

        lenient().when(eventRepository.findByIdAndIsDeletedFalse(couponEvent.getId())).thenReturn(Optional.of(couponEvent));
        lenient().when(customerRepository.findById(anyLong())).thenAnswer(invocation -> {
            Long id = invocation.getArgument(0);
            Customer customer = Customer.builder().build();
            ReflectionTestUtils.setField(customer, "id", id);
            return Optional.of(customer);
        });
        lenient().when(couponBoxRepository.existsByCustomerIdAndCouponEventId(anyLong(), eq(couponEvent.getId()))).thenReturn(false);

        // Initialize Redis with initial quantity
        doNothing().when(couponCountRepository).setInitialQuantity(couponEvent.getId(), couponEvent.getInitialQuantity());
        lenient().when(valueOperations.get("couponCount:" + couponEvent.getId())).thenReturn("100");
        lenient().when(valueOperations.decrement("couponCount:" + couponEvent.getId())).thenAnswer(invocation -> {
            String redisKey = invocation.getArgument(0);
            String value = valueOperations.get(redisKey);
            Long quantity = value != null ? Long.parseLong(value) : null;
            if (quantity != null && quantity > 0) {
                quantity -= 1;
                valueOperations.set(redisKey, quantity.toString());
                return quantity;
            }
            return -1L;
        });
        System.out.println("couponEvent id 있니 없니: " + eventRepository.findByIdAndIsDeletedFalse(couponEvent.getId()));

        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            Customer customer = Customer.builder().build();
            ReflectionTestUtils.setField(customer, "id", (long) i);

            lenient().when(customerRepository.findById((long) i)).thenReturn(Optional.of(customer));

            executorService.submit(() -> {
                try {
                    eventServiceImpl.downloadCoupon(customer.getId(), couponEvent.getId());
                } catch (Exception e) {
                    System.err.println("Exception occurred for customer ID " + customer.getId() + ": " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        executorService.shutdown();

        // Then
        verify(couponBoxRepository, times(threadCount)).save(any(CouponBox.class));
        assertThat(valueOperations.get("couponCount:" + couponEvent.getId())).isEqualTo("0");

        // Clean up Redis
        redisTemplate.delete("couponCount:" + couponEvent.getId());
    }
}



