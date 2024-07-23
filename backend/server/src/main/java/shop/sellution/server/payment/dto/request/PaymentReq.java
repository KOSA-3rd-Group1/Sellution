package shop.sellution.server.payment.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentReq {
    private Long customerId;
    private Long orderId;
    private Long accountId;

}
