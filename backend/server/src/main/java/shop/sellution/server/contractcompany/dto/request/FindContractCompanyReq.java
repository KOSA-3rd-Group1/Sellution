package shop.sellution.server.contractcompany.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.global.annotation.validation.ValidId;
import shop.sellution.server.global.annotation.validation.ValidPassword;

@Getter
@NoArgsConstructor
public class FindContractCompanyReq {

    @NotBlank
    @ValidId
    private String contractAuthId;

    @NotBlank
    @ValidPassword
    private String contractAuthPassword;
}
