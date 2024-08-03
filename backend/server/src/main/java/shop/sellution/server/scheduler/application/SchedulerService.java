package shop.sellution.server.scheduler.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.EventRepository;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.util.PaymentUtil;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final OrderRepository orderRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentUtil paymentUtil;
    private final PaymentService paymentService;
    private final CustomerRepository customerRepository;
    private final EventRepository eventRepository;
    private final ProductRepository productRepository;


    //    @Scheduled(cron = "0 0 19 * * *", zone = "Asia/Seoul")
    @Transactional
    public void regularProcessAt19() {
        log.info("*************** 19시 스케줄러 시작 *************** ");
        // 정기주문(월)에 대해 정기결제를 진행한다.
        regularPayment();
        // 실패한 결제가 있는 정기주문(월)에 대해 재결제를 진행한다.
        regularRetryPayment();
        // 모든 종류의 주문에 대해 배송을 진행한다.
        regularDelivery();
        log.info("*************** 19시 스케줄러 종료 *************** ");
    }

    //    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul") // 자정이여야함
    @Transactional
    public void regularProcessAt0() {
        log.info("*************** 자정 스케줄러 시작 *************** ");
        // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
        regularCustomerTypeToDormant();
        // 이벤트 상태 변경
        regularEventStateUpdate();
        // 배송당일인데 승인이 안된 주문은 취소한다.
        regularOrderCancel();
        // 오늘이 상품할인 마지막날의 다음날이라면 상품할인 종료
        regularProductDiscountEnd();
        log.info("*************** 자정 스케줄러 종료 *************** ");
    }

    public void regularPayment() {
        log.info("*************** 정기결제 시작 *************** ");
        int paymentCount = 0;
        // 1. 승인된 주문이고, 배송상태가 배송전,배송중이고 배송타입이 월정기주문이고 오늘이 결제일인 주문들을 가져온다.
        List<Order> ordersForPayment = orderRepository.findOrdersForRegularPayment(LocalDate.now());
        // 2. 각 주문에 대해 결제를 시도한다.
        for (Order order : ordersForPayment) {
            paymentService.pay(PaymentReq.builder()
                    .orderId(order.getId())
                    .customerId(order.getCustomer().getId())
                    .accountId(order.getAccount().getId())
                    .build());
            // 3. 현재 스케줄러에서 시도한 결제횟수를 증가시킨다.
            paymentCount++;
        }
        log.info("*************** 정기결제된 주문 : {}건 *************** ", paymentCount); // 해당 스케줄러 동작때 몇건의 결제가 진행됬는지
        log.info("*************** 정기결제 종료 *************** ");
    }

    public void regularRetryPayment() {
        log.info("*************** 재결제 시작 *************** ");
        int retryPaymentCount = 0;
        // 1. 승인된 주문이고, 배송상태가 배송전,배송중이고 배송타입이 월정기주문이고 "어제가" 결제일인 주문들을 가져온다.
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Order> ordersForRetry = orderRepository.findOrdersForRegularPayment(yesterday);
        log.info("어제 : {}", yesterday);
        // 2. "어제"가 결제일인 주문들중 "어제" 생성된 결제내역이 PENDING(실패)인지 확인한다.
        for (Order order : ordersForRetry) {
            Long orderId = order.getId();
            log.info("주문 id : {}", orderId);
            PaymentHistory paymentHistory = paymentHistoryRepository.findPendingPaymentHistory(orderId, yesterday.atStartOfDay(), yesterday.plusDays(1).atStartOfDay()); // LocalDate와 LocalDateTime을 비교하기위해..
            // 2.1 "어제" 생성된 결제내역이 PENDING(실패)이면 다시 결제를 시도한다.
            if (paymentHistory != null) {
                boolean result = paymentService.pay(PaymentReq.builder()
                        .orderId(orderId)
                        .customerId(order.getCustomer().getId())
                        .accountId(order.getAccount().getId())
                        .build());
                if (!result) { // 재결제 실패라면 주문 취소
                    order.cancelOrder();
                }
                // 3. 현재 스케줄러에서 시도한 결제횟수를 증가시킨다.
                retryPaymentCount++;
            }
        }
        log.info("*************** 재결제 성공한 주문 : {}건 *************** ", retryPaymentCount);  // 해당 스케줄러 동작때 몇건의 결제가 재시도됬는지 반환
        log.info("*************** 재결제 종료 *************** ");
    }

    public void regularDelivery() {
        log.info("*************** 정기배송 시작 *************** ");
        int deliveryCount = 0;
        // 1. 주문이 승인됬고, 상태가 배송전,배송중이고 오늘이 배송일인 주문들을 가져온다.
        List<Order> ordersForDelivery = orderRepository.findOrdersForRegularDelivery(LocalDate.now());

        for (Order order : ordersForDelivery) {
            // 2. 해당 주문의 가장 최근 결제내역을 확인하여 결제가 완료됬는지 확인한다.
            PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId());
            if (paymentHistory != null && paymentHistory.getStatus() == PaymentStatus.COMPLETE) {
                // 3. 재고가 남아있는지 확인한다.
                boolean hasEnoughStock = order.getOrderedProducts().stream()
                        .allMatch(orderedProduct -> orderedProduct.getProduct().getStock() >= orderedProduct.getCount());

                if (!hasEnoughStock) {
                    // 재고가 없다면 주문 취소시킨다.
                    order.cancelOrder();
                    continue;  // 다음 주문으로 넘어간다.
                }

                // 4. 배송처리를 한다.
                order.changeDeliveryStatus(DeliveryStatus.IN_PROGRESS);
                // 4.1 남은 배송횟수 감소
                order.decreaseRemainingDeliveryCount();
                // 4.2 주문된 상품들의 재고 감소 처리
                order.decreaseProductStock();
                // 4.3 주문한 회원의 최근 배송일자 갱신
                order.getCustomer().updateLatestDeliveryDate(LocalDateTime.now());

                // 5. 배송건수 증가
                deliveryCount++;

                // 6. 남은 배송횟수가 0이면 배송완료 처리, 배송완료시 다음 배송일 계산할 필요가 없다.
                if (order.getRemainingDeliveryCount() == 0) {
                    order.changeDeliveryStatus(DeliveryStatus.COMPLETE);
                    continue;
                }

                // 7. 다음 배송일을 주문타입에 따라 다르게 계산해서 설정해준다.
                switch (order.getType()) {
                    // 7.1 월정기주문이면 다음 배송일을 (오늘 +1일 ) ~ (다음결제일 + 7일) 사이에서 찾는다.
                    case MONTH_SUBSCRIPTION -> {
                        LocalDate startDate = LocalDate.now().plusDays(1);
                        LocalDate endDate = order.getNextPaymentDate().plusDays(7);
                        PaymentUtil.DeliveryInfo deliveryInfo = paymentUtil.calculateDeliveryInfo(startDate, endDate, order.getWeekOptionValue(), paymentUtil.getDeliveryDays(order.getSelectedDays()));
                        order.updateNextDeliveryDate(deliveryInfo.getNextDeliveryDate());
                    }

                    // 7.2 횟수정기주문이면 다음 배송일을 (오늘 +1일 ) ~  부터 찾을때까지 반복하지만. 무한반복문은 좋지않기에 적당히 큰 날짜를 넘긴다.
                    case COUNT_SUBSCRIPTION -> {
                        LocalDate startDate = LocalDate.now().plusDays(1);
                        LocalDate farFutureDate = startDate.plusYears(1);
                        PaymentUtil.DeliveryInfo deliveryInfo = paymentUtil.calculateDeliveryInfo(startDate, farFutureDate, order.getWeekOptionValue(), paymentUtil.getDeliveryDays(order.getSelectedDays()));
                        order.updateNextDeliveryDate(deliveryInfo.getNextDeliveryDate());
                    }
                }
            }

        }
        log.info("*************** 정기배송 처리된 주문 : {}건 *************** ", deliveryCount);  // 해당 스케줄러 동작때 몇건의 배송이 진행됬는지 반환
        log.info("*************** 정기배송 종료 *************** ");
    }


    public void regularCustomerTypeToDormant() {
        log.info("*************** 휴면처리 시작 *************** ");
        // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
        int count = customerRepository.updateDormantCustomerType(LocalDateTime.now().minusDays(60));
        log.info("*************** 변경된 회원 : {}건 *************** ", count);
        log.info("*************** 휴면처리 종료 *************** ");
    }

    @Transactional
    public void regularEventStateUpdate() {
        log.info("*************** 이벤트 상태 변경 시작 *************** ");
        int eventCount = 0;
        List<CouponEvent> couponEventList = eventRepository.findAll();
        for (CouponEvent event : couponEventList) {
            if (!event.isDeleted() && event.getEventEndDate().isBefore(LocalDate.now()) && event.getState() == EventState.ONGOING) {
                event.changeStateToEnd();
                eventCount++;
            } else if (!event.isDeleted() && event.getEventStartDate().isEqual(LocalDate.now()) && event.getState() == EventState.UPCOMING) {
                event.changeStateToOngoing();
                eventCount++;
            }
        }
        log.info("*************** 변경된 이벤트 : {}건 *************** ", eventCount);
        log.info("*************** 이벤트 상태 변경 종료 *************** ");

    }

    @Transactional
    public void regularOrderCancel() { // 배송당일이 됬는데 승인이 안된 주문은 취소한다.
        log.info("*************** 배송당일까지 승인안된 주문 취소 시작 *************** ");
        int count = orderRepository.updateHoldOrderStatusToCancel(LocalDate.now());
        log.info("*************** 취소로 변경된 주문 : {}건 *************** ", count);
        log.info("*************** 배송당일까지 승인안된 주문 취소 종료 *************** ");

    }

    @Transactional
    public void regularProductDiscountEnd() { // 오늘이 상품할인 마지막날의 다음날이라면 상품할인 종료
        log.info("*************** 상품할인이 끝나는 상품들 할인종료처리 시작 *************** ");
        int count = 0;
        List<Product> products = productRepository.findDiscountEndDateIsToday(LocalDate.now().atStartOfDay().plusDays(1));
        for (Product product : products) {
            count++;
            product.finishDiscount();
        }
        log.info("*************** 변경된 상품 : {}건 *************** ", count);
        log.info("*************** 상품할인이 끝나는 상품들 할인종료처리 종료 *************** ");
    }


}
