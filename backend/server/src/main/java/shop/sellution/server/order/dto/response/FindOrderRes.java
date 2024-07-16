package shop.sellution.server.order.dto.response;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.address.domain.Address;
import shop.sellution.server.company.domain.DayOption;
import shop.sellution.server.company.domain.MonthOption;
import shop.sellution.server.company.domain.WeekOption;
import shop.sellution.server.company.domain.type.DayValueType;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.OrderedProduct;
import shop.sellution.server.order.domain.SelectedDay;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.product.domain.Product;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class FindOrderRes {

    private Customer customer;

    private Address address;

    private Long code;

    private OrderType type;

    private OrderStatus status;

    private DeliveryStatus deliveryStatus;

    private int totalPrice;

    private LocalDateTime deliveryStartDate;

    private LocalDateTime deliveryEndDate;

    private int totalDeliveryCount;

    private int remainingDeliveryCount;

    private List<OrderProductDto> orderedProductList;

    private LocalDateTime createdAt;

    private List<DayOption> selectedDayList;

    private WeekOption selectedWeekOption;

    private MonthOption selectedMonthOption;


    public static FindOrderRes fromEntities(Order order, List<OrderedProduct> orderedProducts, List<SelectedDay> selectedDays) {
        return FindOrderRes.builder()
                .customer(order.getCustomer())
                .address(order.getAddress())
                .code(order.getCode())
                .type(order.getType())
                .status(order.getStatus())
                .deliveryStatus(order.getDeliveryStatus())
                .totalPrice(order.getTotalPrice())
                .deliveryStartDate(order.getDeliveryStartDate())
                .deliveryEndDate(order.getDeliveryEndDate())
                .totalDeliveryCount(order.getTotalDeliveryCount())
                .remainingDeliveryCount(order.getRemainingDeliveryCount())
                .orderedProductList(orderedProducts.stream()
                        .map(OrderProductDto::fromEntity)
                        .toList())
                .createdAt(order.getCreatedAt())
                .selectedDayList(selectedDays.stream()
                        .map(SelectedDay::getDayOption)
                        .toList())
                .selectedWeekOption(order.getWeekOption())
                .selectedMonthOption(order.getMonthOption())
                .build();
    }


    @Builder
    @Getter
    static class OrderProductDto {

        private Product product;

        private int count;

        private int discountRate;

        private int price;

        static OrderProductDto fromEntity(OrderedProduct orderedProduct) {
            return OrderProductDto.builder()
                    .product(orderedProduct.getProduct())
                    .count(orderedProduct.getCount())
                    .discountRate(orderedProduct.getDiscountRate())
                    .price(orderedProduct.getPrice())
                    .build();
        }
    }

    @Builder
    @Getter
    static class SelectedDayDto {

        private DayValueType value;

        static SelectedDayDto fromEntity(SelectedDay selectedDay) {
            return SelectedDayDto.builder()
                    .value(selectedDay.getDayOption().getValue())
                    .build();
        }
    }

}
