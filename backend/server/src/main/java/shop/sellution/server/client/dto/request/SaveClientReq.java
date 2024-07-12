package shop.sellution.server.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import shop.sellution.server.client.domain.type.PermissionType;
import shop.sellution.server.global.annotation.validation.ValidId;
import shop.sellution.server.global.annotation.validation.ValidPassword;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

import java.util.Set;

@Getter
@AllArgsConstructor
public class SaveClientReq {

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

    private Set<PermissionType> permissions;
}
