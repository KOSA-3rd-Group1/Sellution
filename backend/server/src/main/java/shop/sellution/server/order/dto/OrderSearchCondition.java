package shop.sellution.server.order.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@Setter
public class OrderSearchCondition {
    private String orderCode;
    private Long customerId;
    private String customerName;
    private String customerPhoneNumber;
    private DeliveryStatus deliveryStatus;
    private OrderStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private OrderType orderType;
}
