package shop.sellution.server.payment.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.SelectedDay;
import shop.sellution.server.order.domain.type.DeliveryStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
@Slf4j
public class PaymentUtil {

    // 결제해야하는 금액 계산 메소드 -> 배송 시작일 ~ 다음 결제일까지의 배송 횟수를 계산하여 결제해야하는 금액을 계산한다.
    public PayInfo calculatePayCost(Order order, LocalDate deliveryStartDate) {
        return switch (order.getType()) {
            case ONETIME, COUNT_SUBSCRIPTION -> PayInfo.builder()
                    .payAmount(order.getTotalPrice()) // 단건 혹은 횟수정기주문이라면 전체 금액을 결제해야한다.
                    .deliveryCount(null) // 단건, 횟수주문은 이번달 배송횟수가 필요없다.
                    .build();
            case MONTH_SUBSCRIPTION -> { // 월정기주문이라면
                if (order.getPaymentCount() == 0) { // 첫결제라면
//                    LocalDate monday = order.getDeliveryStartDate().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
                    LocalDate monday = order.getDeliveryStartDate();
                    LocalDate endDate = order.getDeliveryStartDate().plusMonths(1);
                    log.info("monday : {}, endDate : {}", monday,endDate);
                    DeliveryInfo deliveryInfo = calculateDeliveryInfo(monday, endDate, order.getWeekOption().getWeekValue(), getDeliveryDays(order.getSelectedDays()));
                    log.info("deliveryInfo : {}", deliveryInfo);
                    yield PayInfo.builder()
                            .payAmount(order.getPerPrice() * deliveryInfo.getTotalDeliveryCount()) // 이번달 결제금액
                            .deliveryCount(deliveryInfo.getTotalDeliveryCount()) // 이번달 배송횟수
                            .build();
                }else{
                    LocalDate startDate = order.getDeliveryStartDate().plusMonths(order.getPaymentCount()+1).plusDays(1);
                    LocalDate endDate = order.getDeliveryStartDate().plusMonths(order.getPaymentCount()+2);
                    DeliveryInfo deliveryInfo = calculateDeliveryInfo(startDate, endDate, order.getWeekOption().getWeekValue(), getDeliveryDays(order.getSelectedDays()));
                    yield PayInfo.builder()
                            .payAmount(order.getPerPrice() * deliveryInfo.getTotalDeliveryCount()) // 이번달 결제금액
                            .deliveryCount(deliveryInfo.getTotalDeliveryCount()) // 이번달 배송횟수
                            .build();
                }
            }
        };
    }

    // 환불 금액을 계산하는 메소드
    public int calculateRefundCost(Order order) {
        return switch (order.getType()) {
            case ONETIME -> order.getDeliveryStatus() == DeliveryStatus.BEFORE_DELIVERY ? order.getTotalPrice() : 0; // 단건은 배송전에만 환불가능
            case MONTH_SUBSCRIPTION -> { // 월 정기주문은 환불시점 +1일 ~ (다음결제일+7일)의 배송횟수를 계산하여 환불해야하는 금액을 계산한다.
                LocalDate startDate = null;
                if (LocalDate.now().isBefore(order.getDeliveryStartDate())) { // 배송시작일 이전에 환불이면 배송시작일부터 계산
                    startDate = order.getDeliveryStartDate();
                } else {
                    startDate = LocalDate.now().plusDays(1);
                }
                LocalDate endDate = order.getDeliveryStartDate().plusMonths(order.getPaymentCount());
                DeliveryInfo deliveryInfo = calculateDeliveryInfo(startDate, endDate, order.getWeekOption().getWeekValue(), getDeliveryDays(order.getSelectedDays()));
                log.info("환불정보 시작일 : {}, 종료일 : {}, 배송정보 : {}, 배송한건당 가격 :{}", startDate, endDate, deliveryInfo, order.getPerPrice());
                yield (order.getPerPrice() * deliveryInfo.getTotalDeliveryCount());
            }
            case COUNT_SUBSCRIPTION -> order.getRemainingDeliveryCount() * order.getPerPrice(); // 횟수 정기주문은 남은 횟수 * 배송 당 가격을 계산하여 환불해야하는 금액을 계산한다.
        };
    }

    public DeliveryInfo calculateDeliveryInfo(
            LocalDate startDate,
            LocalDate endDate,
            int weekly,
            Set<DayOfWeek> deliveryDaysSet
    ) {
        int totalDeliveryCount = 0;
        LocalDate currentDate = startDate;
        LocalDate nextDeliveryDate = null;

        while (!currentDate.isAfter(endDate)) {
            if (deliveryDaysSet.contains(currentDate.getDayOfWeek()) &&
                    (ChronoUnit.WEEKS.between(startDate, currentDate) % weekly == 0)) {
                totalDeliveryCount++;
                if (nextDeliveryDate == null) {
                    nextDeliveryDate = currentDate;
                }
            }
            currentDate = currentDate.plusDays(1);
        }

        return new DeliveryInfo(totalDeliveryCount, nextDeliveryDate);
    }


    @Getter
    @AllArgsConstructor
    @ToString
    public static class DeliveryInfo {
        private int totalDeliveryCount;
        private LocalDate nextDeliveryDate;
    }




    public Set<DayOfWeek> getDeliveryDays(List<SelectedDay> selectedDays) {
        return selectedDays.stream()
                .map(sd -> sd.getDayOption().getDayValue().changeToDayOfWeek())
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(DayOfWeek.class)));
    }





}