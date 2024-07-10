package shop.sellution.server.account.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CheckAccountReq {

    @NotBlank
    private final String bankCode;
    @NotBlank
    private final String bankNum;
}
