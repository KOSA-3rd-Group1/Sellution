package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.global.annotation.validation.ValidId;
import shop.sellution.server.global.annotation.validation.ValidPassword;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaveCustomerReq {

    @NotNull
    private Long companyId;

    @NotBlank
    @ValidId
    private String username;

    @NotBlank
    @ValidPassword
    private String password;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;
}
