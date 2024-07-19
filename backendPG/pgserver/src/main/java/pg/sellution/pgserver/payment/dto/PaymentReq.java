package pg.sellution.pgserver.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PaymentReq {
    @NotBlank(message = "은행코드는 필수 입니다.")
    private final String bankCode;
    @NotBlank (message = "계좌번호는 필수 입니다.")
    private final String accountNumber;
    @NotBlank (message = "금액은 필수 입니다.")
    private int price;
}
