package shop.sellution.server.scheduler.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.util.PaymentUtil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_ENOUGH_STOCK;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final OrderRepository orderRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentUtil paymentUtil;
    private final PaymentService paymentService;
    private final CustomerRepository customerRepository;


//    @Scheduled(cron = "0 0 19 * * *", zone = "Asia/Seoul")
    @Transactional
    public void regularProcess() {
        log.info("*************** 스케줄러 시작 *************** ");
        log.info("*************** 정기결제 시작 *************** ");
        // 정기주문(월)에 대해 정기결제를 진행한다.
        int paymentCount = regularPayment();
        log.info("*************** 정기결제 종료 *************** ");
        log.info("*************** 재결제 시작 *************** ");
        // 실패한 결제가 있는 정기주문(월)에 대해 재결제를 진행한다.
        int retryPaymentCount = regularRetryPayment();
        log.info("*************** 재결제 종료 *************** ");
        log.info("*************** 정기배송 시작 *************** ");
        // 모든 종류의 주문에 대해 배송을 진행한다.
        int deliveryCount = regularDelivery();
        log.info("*************** 정기배송 종료 *************** ");
        log.info("*************** 휴면처리 시작 *************** ");
        // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
        int dormantCustomerCount = regularCustomerTypeToDormant();
        log.info("*************** 휴면처리 종료 *************** ");
        log.info("*************** 스케줄러 종료 *************** ");
        log.info("*************** 정기결제 : {}건 *************** ", paymentCount);
        log.info("*************** 정기결제 재시도 : {}건 *************** ", retryPaymentCount);
        log.info("*************** 정기배송 : {}건 *************** ", deliveryCount);
        log.info("*************** 휴면회원 처리 : {}건 *************** ", dormantCustomerCount);

    }

    public int regularPayment() {
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
        return paymentCount; // 해당 스케줄러 동작때 몇건의 결제가 진행됬는지 반환
    }

    public int regularRetryPayment() {
        int retryPaymentCount = 0;
        // 1. 승인된 주문이고, 배송상태가 배송전,배송중이고 배송타입이 월정기주문이고 "어제가" 결제일인 주문들을 가져온다.
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Order> ordersForRetry = orderRepository.findOrdersForRegularPayment(yesterday);
        log.info("어제 : {}", yesterday);
        // 2. "어제"가 결제일인 주문들중 "어제" 생성된 결제내역이 PENDING(실패)인지 확인한다.
        for (Order order : ordersForRetry) {
            Long orderId = order.getId();
            log.info("주문 id : {}", orderId);
            PaymentHistory paymentHistory = paymentHistoryRepository.findPendingPaymentHistory(orderId, yesterday.atStartOfDay(),yesterday.plusDays(1).atStartOfDay()); // LocalDate와 LocalDateTime을 비교하기위해..
            // 2.1 "어제" 생성된 결제내역이 PENDING(실패)이면 다시 결제를 시도한다.
            if (paymentHistory != null) {
                paymentService.pay(PaymentReq.builder()
                        .orderId(orderId)
                        .customerId(order.getCustomer().getId())
                        .accountId(order.getAccount().getId())
                        .build());
                // 3. 현재 스케줄러에서 시도한 결제횟수를 증가시킨다.
                retryPaymentCount++;
            }
        }
        return retryPaymentCount; // 해당 스케줄러 동작때 몇건의 결제가 재시도됬는지 반환
    }

    public int regularDelivery() {
        int deliveryCount = 0;
        // 1. 주문이 승인됬고, 상태가 배송전,배송중이고 오늘이 배송일인 주문들을 가져온다.
        List<Order> ordersForDelivery = orderRepository.findOrdersForRegularDelivery(LocalDate.now());

        for (Order order : ordersForDelivery) {
            // 2. 해당 주문의 가장 최근 결제내역을 확인하여 결제가 완료됬는지 확인한다.
            PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId());
            if (paymentHistory != null && paymentHistory.getStatus() == PaymentStatus.COMPLETE) {
                // 3. 재고가 남아있는지 확인한다.
                order.getOrderedProducts().forEach(orderedProduct -> {
                    if (orderedProduct.getProduct().getStock() < orderedProduct.getCount()) {
                        throw new BadRequestException(NOT_ENOUGH_STOCK);
                    }
                });

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
                switch (order.getType())
                {
                    // 7.1 월정기주문이면 다음 배송일을 (오늘 +1일 ) ~ (다음결제일 + 7일) 사이에서 찾는다.
                    case MONTH_SUBSCRIPTION ->{
                        LocalDate startDate = LocalDate.now().plusDays(1);
                        LocalDate endDate = order.getNextPaymentDate().plusDays(7);
                        PaymentUtil.DeliveryInfo deliveryInfo = paymentUtil.calculateDeliveryInfo(startDate, endDate, order.getWeekOption().getWeekValue(), paymentUtil.getDeliveryDays(order.getSelectedDays()));
                        order.updateNextDeliveryDate(deliveryInfo.getNextDeliveryDate());
                    }

                    // 7.2 횟수정기주문이면 다음 배송일을 (오늘 +1일 ) ~  부터 찾을때까지 반복하지만. 무한반복문은 좋지않기에 적당히 큰 날짜를 넘긴다.
                    case COUNT_SUBSCRIPTION->{
                        LocalDate startDate = LocalDate.now().plusDays(1);
                        LocalDate farFutureDate = startDate.plusYears(1);
                        PaymentUtil.DeliveryInfo deliveryInfo = paymentUtil.calculateDeliveryInfo(startDate, farFutureDate, order.getWeekOption().getWeekValue(), paymentUtil.getDeliveryDays(order.getSelectedDays()));
                        order.updateNextDeliveryDate(deliveryInfo.getNextDeliveryDate());
                    }
                }
            }

        }

        return deliveryCount; // 해당 스케줄러 동작때 몇건의 배송이 진행됬는지 반환
    }


    public int regularCustomerTypeToDormant() {
        // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
        return customerRepository.updateDormantCustomerType(LocalDateTime.now().minusDays(60));
    }
}
