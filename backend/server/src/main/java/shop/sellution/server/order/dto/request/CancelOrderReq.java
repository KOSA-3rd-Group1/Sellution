package shop.sellution.server.order.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CancelOrderReq {

    @NotNull(message = "주문자 아이디는 필수입니다.")
    private Long customerId;
    @NotNull(message = "계좌 아이디는 필수입니다.")
    private Long accountId;
}
