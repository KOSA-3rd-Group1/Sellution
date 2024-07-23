package shop.sellution.server.payment.util;

import org.springframework.stereotype.Component;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.SelectedDay;
import shop.sellution.server.order.domain.type.DeliveryStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class PaymentUtil {

    // 결제해야하는 금액 계산 메소드 -> 배송 시작일 ~ 다음 결제일까지의 배송 횟수를 계산하여 결제해야하는 금액을 계산한다.
    public int calculatePayCost(Order order, LocalDate deliveryStartDate) {
        return switch (order.getType()) {
            case ONETIME, COUNT_SUBSCRIPTION -> order.getTotalPrice(); // 단건 혹은 횟수정기주문이라면 전체 금액을 결제해야한다.
            case MONTH_SUBSCRIPTION -> { // 월정기주문이라면
                int deliveryCount = calculateDeliveryCount(deliveryStartDate, order.getNextPaymentDate(), order);// 결제당일 ~ 다음 결제일까지의 배송횟수를 계산한다.
                yield order.getPerPrice() * deliveryCount; // 배송 횟수 * 배송 당 가격을 계산하여 결제해야하는 금액을 계산한다.
            }
        };
    }

    // 환불 금액을 계산하는 메소드
    public int calculateRefundCost(Order order) {
        return switch (order.getType()) {
            case ONETIME -> order.getDeliveryStatus() == DeliveryStatus.BEFORE_DELIVERY ? order.getTotalPrice() : 0; // 단건은 배송전에만 환불가능
            case MONTH_SUBSCRIPTION -> { // 월 정기주문은 환불시점 ~ 다음 결제일까지의 배송횟수를 계산하여 환불해야하는 금액을 계산한다.
                int deliveryCount = calculateDeliveryCount(LocalDate.now(), order.getNextPaymentDate(), order);
                yield order.getPerPrice() * deliveryCount;
            }
            case COUNT_SUBSCRIPTION -> order.getRemainingDeliveryCount() * order.getPerPrice(); // 횟수 정기주문은 남은 횟수 * 배송 당 가격을 계산하여 환불해야하는 금액을 계산한다.
        };
    }

    // 주어진 기간 동안의 배송 횟수를 계산하는 메소드
    public int calculateDeliveryCount(LocalDate startDate, LocalDate endDate, Order order) {
        List<DayOfWeek> deliveryDays = getDeliveryDays(order.getSelectedDays()); // 선택된 배송 요일
        int weekly = order.getWeekOption().getWeekValue(); // n 주마다
        int totalDeliveries = 0; // 총 배송 횟수
        LocalDate currentDate = startDate.minusDays(1); // 시작일 - 1일을 해줘서 시작일도 검증에 포함되게한다.

        while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) { // 시작일 ~ 종료일까지
            for (DayOfWeek day : deliveryDays) { // 선택된 배송 요일을 반복해서 돌면서
                LocalDate deliveryDate = currentDate.with(TemporalAdjusters.nextOrSame(day)); // 다음 배송 요일 날짜를 계산한다.
                if (deliveryDate.isBefore(endDate) || deliveryDate.isEqual(endDate)) { // 다음 배송 요일이 종료일보다 이전이라면
                    totalDeliveries++; // 총 배송 횟수를 증가시킨다.
                }
            }
            currentDate = currentDate.plusWeeks(weekly); // n 주마다 배송한다.
        }

        return totalDeliveries; // 총 배송 횟수를 반환한다.
    }

    // 선택된 배송 요일을 가져오는 메소드
    public List<DayOfWeek> getDeliveryDays(List<SelectedDay> selectedDays) {
        return selectedDays.stream()
                .map(sd -> sd.getDayOption().getDayValue().changeToDayOfWeek())
                .collect(Collectors.toList());
    }

    // 정기주문 (월) 일때 - 기간중 선택된 요일이 있는 가장 가까운 날짜를 고르는 메소드
    public LocalDate calculateNextDeliveryDateForMonthOrder(LocalDate startDate, LocalDate endDate, Order order) {

        List<DayOfWeek> deliveryDays = getDeliveryDays(order.getSelectedDays()); // 선택된 배송 요일
        LocalDate nearestDeliveryDate = null;

        while (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {

            // 현재 주의 모든 배송 가능일 계산
            for (DayOfWeek day : deliveryDays) {
                LocalDate possibleDeliveryDate = startDate.with(TemporalAdjusters.nextOrSame(day));

                // 시작일 이후의 가장 가까운 배송일 선택
                if (possibleDeliveryDate.isAfter(startDate)) {
                    if (nearestDeliveryDate == null || possibleDeliveryDate.isBefore(nearestDeliveryDate)) {
                        nearestDeliveryDate = possibleDeliveryDate;
                    }
                }
            }
        }
        return nearestDeliveryDate;
    }

    // 정기주문(횟수) 일때 - 남은횟수중 선택된 요일이 있는 가장 가까운 날짜를 고르는 메소드
    public LocalDate calculateNextDeliveryDateForCountOrder(LocalDate startDate, Order order) {
        List<DayOfWeek> deliveryDays = getDeliveryDays(order.getSelectedDays()); // 선택된 배송 요일
        LocalDate nearestDeliveryDate = null;

        for (DayOfWeek day : deliveryDays) {
            LocalDate possibleDeliveryDate = startDate.with(TemporalAdjusters.nextOrSame(day));
            if (nearestDeliveryDate == null || possibleDeliveryDate.isBefore(nearestDeliveryDate)) {
                nearestDeliveryDate = possibleDeliveryDate;
            }

        }
        return nearestDeliveryDate;
    }
}