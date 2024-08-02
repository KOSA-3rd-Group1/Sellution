package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidAuthNumber;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public class FindCustomerSignupSmsAuthNumberReq {
    @NotNull
    private Long companyId;

    @NotBlank
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;

    @NotBlank
    @ValidAuthNumber
    private String authNumber;
}
