package shop.sellution.server.auth.application;

import shop.sellution.server.auth.dto.response.RefreshAuthRes;

public interface AuthService {
    RefreshAuthRes refreshToken(String refreshToken);
}
