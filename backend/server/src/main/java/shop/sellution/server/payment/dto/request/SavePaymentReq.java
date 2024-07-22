package shop.sellution.server.payment.dto.request;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.order.domain.type.OrderType;

@Getter
@Builder
public class SavePaymentReq {

    private Long orderId;
    private Long accountId;
    private int price;
    private OrderType type;
}
