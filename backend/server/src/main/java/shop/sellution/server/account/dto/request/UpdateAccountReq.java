package shop.sellution.server.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidBankCode;

@Getter
@AllArgsConstructor
public class UpdateAccountReq {

    @NotBlank(message = "계좌번호는 필수입니다.")
    private String accountNumber;

    @NotNull(message = "은행 코드는 필수입니다.")
    @ValidBankCode
    private String bankCode;
}
