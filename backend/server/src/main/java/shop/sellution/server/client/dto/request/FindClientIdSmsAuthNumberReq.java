package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public class FindClientIdSmsAuthNumberReq {

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;
}
