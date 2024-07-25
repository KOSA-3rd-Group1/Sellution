package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyAuthCodeReq {
    @NotNull
    private Long customerId;

    @NotBlank
    private String authCode;
}
