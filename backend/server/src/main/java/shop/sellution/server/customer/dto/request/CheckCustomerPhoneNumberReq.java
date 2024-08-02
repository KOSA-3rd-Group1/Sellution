package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public class CheckCustomerPhoneNumberReq {
    @NotNull
    private Long companyId;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;
}
