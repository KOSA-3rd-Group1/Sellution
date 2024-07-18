package shop.sellution.server.order.dto.request;

import lombok.Getter;

@Getter
public class CancelOrderReq {
    private Long customerId;
    private Long accountId;
}
