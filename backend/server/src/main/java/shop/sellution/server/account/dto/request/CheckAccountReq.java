package shop.sellution.server.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidBankCode;

@Getter
@Builder
@AllArgsConstructor
public class CheckAccountReq {

    @NotBlank (message = "은행코드는 필수 입니다.")
    @ValidBankCode
    private final String bankCode;

    @NotBlank (message = "계좌번호는 필수 입니다.")
    private final String accountNumber;

    public static CheckAccountReq fromDto(SaveAccountReq saveAccountReq) {
        return CheckAccountReq.builder()
                .bankCode(saveAccountReq.getBankCode())
                .accountNumber(saveAccountReq.getAccountNumber())
                .build();
    }
    public static CheckAccountReq fromDto(UpdateAccountReq updateAccountReq) {
        return CheckAccountReq.builder()
                .bankCode(updateAccountReq.getBankCode())
                .accountNumber(updateAccountReq.getAccountNumber())
                .build();
    }
}
