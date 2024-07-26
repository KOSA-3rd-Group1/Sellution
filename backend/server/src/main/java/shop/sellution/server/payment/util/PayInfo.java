package shop.sellution.server.payment.util;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayInfo {
    private int payAmount;
    private Integer deliveryCount;
}
