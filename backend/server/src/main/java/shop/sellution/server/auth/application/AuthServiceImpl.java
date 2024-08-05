package shop.sellution.server.auth.application;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.auth.dto.response.RefreshAuthRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.util.JWTUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final RefreshTokenService refreshTokenService;
    private final JWTUtil jwtUtil;

    @Override
    public RefreshAuthRes refreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new AuthException(ExceptionCode.NULL_REFRESH_TOKEN);
        }

        Claims claims = jwtUtil.validateToken(refreshToken);
        String userRole = jwtUtil.getRoles(refreshToken).get(0);
        Long userId = claims.get("userId", Long.class);
        Long companyId = claims.get("companyId", Long.class);
        String username = claims.get("username", String.class);


        if (!refreshTokenService.validateRefreshToken(userId, companyId, userRole, refreshToken)) {
            refreshTokenService.deleteRefreshToken(userId, companyId, userRole);
            throw new AuthException(ExceptionCode.INVALID_REFRESH_TOKEN);
        }

        Map<String, Object> newClaims = getClaims(userId, companyId, username, jwtUtil.getRoles(refreshToken));

        String newAccessToken = jwtUtil.generateToken("access", newClaims);
        String newRefreshToken = jwtUtil.generateToken("refresh", newClaims);

        refreshTokenService.saveRefreshToken(userId, companyId, userRole, newRefreshToken);
        System.out.println("여기도 나오나?" + refreshToken);

        return new RefreshAuthRes(newAccessToken, newRefreshToken);
    }

    private Map<String, Object> getClaims(Long userId, Long companyId, String username, List<String> userRoles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("companyId", companyId);
        claims.put("username", username);
        claims.put("roles", userRoles);
        return claims;
    }
}
