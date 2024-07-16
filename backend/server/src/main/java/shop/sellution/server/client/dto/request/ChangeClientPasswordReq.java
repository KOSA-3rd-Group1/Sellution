package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidPassword;

@Getter
public class ChangeClientPasswordReq {

    @NotBlank
    private String token;

    @NotBlank
    @ValidPassword
    private String newPassword;
}
