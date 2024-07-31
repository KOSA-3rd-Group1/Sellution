package shop.sellution.server.order.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import shop.sellution.server.address.dto.response.FindAddressSummaryRes;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.customer.dto.resonse.FindCustomerSummaryRes;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.OrderedProduct;
import shop.sellution.server.order.domain.SelectedDay;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.product.dto.ProductImageSummary;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Builder
@Getter
public class FindOrderRes {

    private FindCustomerSummaryRes customer;

    private FindAddressSummaryRes address;

    private String orderCode;

    private Long orderId;

    private Long accountId;

    private OrderType type;

    private OrderStatus status;

    private DeliveryStatus deliveryStatus;

    private int perPrice;

    private int totalPrice;

    private LocalDate deliveryStartDate;

    private LocalDate nextDeliveryDate;

    private LocalDate deliveryEndDate;

    private int totalDeliveryCount;

    private int remainingDeliveryCount;

    private List<FindOrderedProductRes> orderedProductList;

    private LocalDateTime orderCreatedAt;

    private List<DayValueType> selectedDayList;

    private Integer selectedWeekOption;

    private Integer selectedMonthOption;

    private Long couponEventId;

    private String couponName;

    private Integer couponDiscountRate;

    private Integer paymentCount;

    private LocalDate nextPaymentDate;

    private Integer thisMonthDeliveryCount;



    public static FindOrderRes fromEntities(Order order, List<OrderedProduct> orderedProducts, List<SelectedDay> selectedDays, Map<Long, List<ProductImageSummary>> productImageMap) {
        return FindOrderRes.builder()
                .customer(FindCustomerSummaryRes.fromEntity(order.getCustomer()))
                .address(FindAddressSummaryRes.fromEntity(order.getAddress()))
                .orderId(order.getId())
                .orderCode(order.getCode())
                .type(order.getType())
                .accountId(order.getAccount().getId())
                .status(order.getStatus())
                .deliveryStatus(order.getDeliveryStatus())
                .perPrice(order.getPerPrice())
                .totalPrice(order.getTotalPrice())
                .deliveryStartDate(order.getDeliveryStartDate())
                .nextDeliveryDate(order.getNextDeliveryDate())
                .deliveryEndDate(order.getDeliveryEndDate())
                .totalDeliveryCount(order.getTotalDeliveryCount())
                .remainingDeliveryCount(order.getRemainingDeliveryCount())
                .orderedProductList(orderedProducts.stream()
                        .map(op -> FindOrderedProductRes.fromEntity(op, productImageMap.get(op.getProduct().getProductId())))
                        .toList())
                .orderCreatedAt(order.getCreatedAt())
                .selectedDayList(selectedDays.stream()
                        .map(SelectedDay::getDayValueType)
                        .toList())
                .selectedWeekOption(order.getWeekOptionValue() == null ? null : order.getWeekOptionValue())
                .selectedMonthOption(order.getMonthOptionValue() == null ? null : order.getMonthOptionValue())
                .couponEventId(order.getCouponEvent() != null ? order.getCouponEvent().getId() : null)
                .couponName(order.getCouponEvent() != null ? order.getCouponEvent().getCouponName() : null)
                .couponDiscountRate(order.getCouponEvent() != null ? order.getCouponEvent().getCouponDiscountRate() : null)
                .thisMonthDeliveryCount(order.getThisMonthDeliveryCount())
                .nextPaymentDate(order.getNextPaymentDate())
                .paymentCount(order.getPaymentCount())
                .build();
    }

}
