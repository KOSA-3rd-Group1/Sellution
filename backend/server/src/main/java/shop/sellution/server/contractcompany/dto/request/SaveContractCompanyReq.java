package shop.sellution.server.contractcompany.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidBusinessRegistrationNumber;
import shop.sellution.server.global.annotation.validation.ValidId;
import shop.sellution.server.global.annotation.validation.ValidPassword;

@Getter
@Builder
public class SaveContractCompanyReq {

    @NotBlank
    @Size(min = 1, max = 100)
    private String contractCompanyName;

    @NotBlank
    @ValidBusinessRegistrationNumber
    private String businessRegistrationNumber;

    @NotBlank
    @ValidId
    private String contractAuthId;

    @NotBlank
    @ValidPassword
    private String contractAuthPassword;
}
