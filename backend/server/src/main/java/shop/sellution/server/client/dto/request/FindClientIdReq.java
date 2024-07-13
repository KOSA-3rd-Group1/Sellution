package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidAuthNumber;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public class FindClientIdReq {

    @NotBlank
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;

    @NotBlank
    @ValidAuthNumber
    private String authNumber;
}
