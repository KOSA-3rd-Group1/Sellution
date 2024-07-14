package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidId;

@Getter
public class CheckClientUsernameReq {

    @NotBlank
    @ValidId
    private String username;
}
