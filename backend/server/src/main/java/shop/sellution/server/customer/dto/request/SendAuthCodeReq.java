package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendAuthCodeReq {
    @NotNull
    private Long customerId;

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber;
}
