package shop.sellution.server.scheduler.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.dto.request.PaymentReq;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.INTERNAL_SEVER_ERROR;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final OrderRepository orderRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentService paymentService;


    // 정기 결제 및 정기 배송 - 임시로 1분 마다 진행
//    @Scheduled(cron = "0 0/1 * * * *")
    @Transactional
    public void regularProcess() {
        log.info("스케줄러 시작");

        LocalDateTime now = LocalDateTime.now();
        // 승인된 주문이고, 배송상태가 배송전,배송중 인 주문들만 가져온다.
        orderRepository.findOrdersForRegularPayment()
                .forEach(order -> {

                    // 다음 배송일 계산
                    LocalDateTime nextDeliveryDate = calculateNextDeliveryDate(order);
                    // 다음 배송일이 있고, 다음 배송일이 오늘 기준 하루전, 2일전인 주문에 대해 정기결제 로직 수행
                    if (nextDeliveryDate != null && now.isBefore(nextDeliveryDate)) {
                        log.info("스케줄러 - 정기 결제 시작 - 주문 아이디 {}",order.getId());
                        paymentService.pay(
                                PaymentReq.builder()
                                        .accountId(order.getAccount().getId())
                                        .orderId(order.getId())
                                        .customerId(order.getAccount().getId())
                                        .build()
                        );
                        log.info("스케줄러 - 정기 결제 성공 - 주문 아이디 {}",order.getId());
                    }
                    // ----------------------------------------

                    // 오늘이 배송일인 주문에 대해 배송처리
                    if (nextDeliveryDate != null && now.isEqual(nextDeliveryDate)) {
                        // 해당 주문이 현재 배송에 대해 결제가 되어있는지 확인한다. [ 해당 주문의 가장 최근 결제내역을 확인해서 결제완료된 상태인지 확인한다. ]
                        PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId());
                        if(paymentHistory.getStatus() == PaymentStatus.COMPLETE)
                        {
                            log.info("스케줄러 - 정기 배송 시작 - 주문 아이디 {}",order.getId());

                            // 남은 배송횟수 감소
                            order.decreaseRemainingDeliveryCount();
                            // 남은 배송횟수가 0이면 배송완료처리
                            if(order.getRemainingDeliveryCount() == 0) {
                                order.completeDelivery();
                            }
                            // 주문의 상품재고 감소
                            order.decreaseProductStock();
                            log.info("스케줄러 - 정기 배송 성공 - 주문 아이디 {}",order.getId());

                        }
                    }
                });
        log.info("스케줄러 종료");
    }




    // 가장 가까운 배송일자 계산
    public LocalDateTime calculateNextDeliveryDate(Order order) {
        // 단건주문인 경우
        if (order.getType().isOnetime()) {
            return order.getDeliveryEndDate();
        }

        // 선택된 요일값 [월,화,수 ... ]
        List<DayOfWeek> deliveryDays = order.getSelectedDays().stream()
                .map((sd) -> sd.getDayOption().getDayValue().changeToDayOfWeek())
                .sorted()
                .toList();

        // 선택된 n 주차 마다
        int selectedWeekly = order.getWeekOption().getWeekValue();
        // 선택된 배송 시작일
        LocalDateTime startDate = order.getDeliveryStartDate();
        // 마지막 배송일
        LocalDateTime endDate = order.getDeliveryEndDate();
        // 가장 가까운 배송일
        LocalDateTime nextDeliveryDate = null;


        // 정기주문 [ 월 단위 ] 인 경우
        if (order.getType().isMonthSubscription()) {
            // 선택된 n 개월 동안
            int selectedMonth = order.getMonthOption().getMonthValue();
            LocalDateTime subscriptionEndDate = startDate.plusMonths(selectedMonth); // 구독 기간 [ 정기 배송 기간 ]

            // 선택된 배송 요일에 대해 반복문을 돌아서 가장 가까운 배송일을 찾는다.
            for (DayOfWeek day : deliveryDays) {
                nextDeliveryDate = startDate.with(TemporalAdjusters.nextOrSame(day));
                if (nextDeliveryDate.isBefore(subscriptionEndDate) || nextDeliveryDate.isEqual(subscriptionEndDate)) { // 그 날짜가 구독기간 내에 있으면
                    // 다음 배송일 갱신
                    order.updateNextDeliveryDate(nextDeliveryDate);
                    return nextDeliveryDate;
                }
            }
            // 구독기간안에 가장 가까운 배송일이 없다는것은 더이상 배송할일 없다는것이므로 주문을 배송완료처리한다.
            order.completeDelivery();
            // 다음 배송일이 없으므로 null을 리턴
            return null;

        } else { // 정기주문 [횟수 단위] 인 경우

            // 선택된 배송 요일에 대해 반복문을 돌아서 가장 가까운 배송일을 찾는다.
            for (DayOfWeek day : deliveryDays) {
                nextDeliveryDate = startDate.with(TemporalAdjusters.nextOrSame(day));
                // 다음 배송일 갱신
                order.updateNextDeliveryDate(nextDeliveryDate);
                return nextDeliveryDate;
            }

        }

        throw new BadRequestException(INTERNAL_SEVER_ERROR);
    }
}
