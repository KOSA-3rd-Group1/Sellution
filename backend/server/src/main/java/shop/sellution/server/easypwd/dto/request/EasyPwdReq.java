package shop.sellution.server.easypwd.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EasyPwdReq {
    @NotNull(message = "간편비밀번호는 필수값 입니다.")
    private String password;
}
