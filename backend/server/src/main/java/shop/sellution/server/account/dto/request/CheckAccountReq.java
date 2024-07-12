package shop.sellution.server.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CheckAccountReq {

    @NotBlank (message = "은행코드는 필수 입니다.")
    private final String bankCode;
    @NotBlank (message = "계좌번호는 필수 입니다.")
    private final String accountNumber;
}
