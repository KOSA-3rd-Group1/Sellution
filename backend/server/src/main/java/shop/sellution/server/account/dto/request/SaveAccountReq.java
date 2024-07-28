package shop.sellution.server.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.global.annotation.validation.ValidBankCode;

@Getter
@Setter
@Builder
public class SaveAccountReq {

    @NotBlank(message = "계좌번호는 필수입니다.")
    private String accountNumber;

    @NotNull(message = "은행 코드는 필수입니다.")
    @ValidBankCode
    private String bankCode;
}
