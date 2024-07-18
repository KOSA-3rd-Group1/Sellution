package shop.sellution.server.order.dto;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class OrderSearchCondition {
    private Long orderCode;
    private Long customerId;
    private String customerName;
    private String customerPhoneNumber;
    private DeliveryStatus deliveryStatus;
    private OrderStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
