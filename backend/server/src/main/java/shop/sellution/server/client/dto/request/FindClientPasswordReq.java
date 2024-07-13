package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidAuthNumber;
import shop.sellution.server.global.annotation.validation.ValidId;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public class FindClientPasswordReq {

    @NotBlank
    @ValidId
    private String username;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;

    @NotBlank
    @ValidAuthNumber
    private String authNumber;
}
