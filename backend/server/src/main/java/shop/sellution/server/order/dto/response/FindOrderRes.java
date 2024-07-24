package shop.sellution.server.order.dto.response;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.address.dto.response.FindAddressSummaryRes;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.customer.dto.resonse.FindCustomerSummaryRes;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.OrderedProduct;
import shop.sellution.server.order.domain.SelectedDay;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class FindOrderRes {

    private FindCustomerSummaryRes customer;

    private FindAddressSummaryRes address;

    private Long orderCode;

    private OrderType type;

    private OrderStatus status;

    private DeliveryStatus deliveryStatus;

    private int totalPrice;

    private LocalDate deliveryStartDate;

    private LocalDate deliveryEndDate;

    private int totalDeliveryCount;

    private int remainingDeliveryCount;

    private List<FindOrderedProductRes> orderedProductList;

    private LocalDateTime createdAt;

    private List<DayValueType> selectedDayList;

    private Integer selectedWeekOption;

    private Integer selectedMonthOption;


    public static FindOrderRes fromEntities(Order order, List<OrderedProduct> orderedProducts, List<SelectedDay> selectedDays) {
        return FindOrderRes.builder()
                .customer(FindCustomerSummaryRes.fromEntity(order.getCustomer()))
                .address(FindAddressSummaryRes.fromEntity(order.getAddress()))
                .orderCode(order.getCode())
                .type(order.getType())
                .status(order.getStatus())
                .deliveryStatus(order.getDeliveryStatus())
                .totalPrice(order.getTotalPrice())
                .deliveryStartDate(order.getDeliveryStartDate())
                .deliveryEndDate(order.getDeliveryEndDate())
                .totalDeliveryCount(order.getTotalDeliveryCount())
                .remainingDeliveryCount(order.getRemainingDeliveryCount())
                .orderedProductList(orderedProducts.stream()
                        .map(FindOrderedProductRes::fromEntity)
                        .toList())
                .createdAt(order.getCreatedAt())
                .selectedDayList(selectedDays.stream()
                        .map((sd) -> sd.getDayOption().getDayValue())
                        .toList())
                .selectedWeekOption(order.getWeekOption() == null ? null : order.getWeekOption().getWeekValue())
                .selectedMonthOption(order.getMonthOption() == null ? null : order.getMonthOption().getMonthValue())
                .build();
    }

}
