package shop.sellution.server.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RefreshAuthRes {
    private String accessToken;
    private String refreshToken;
}
