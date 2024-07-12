package shop.sellution.server.auth.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.auth.application.AuthService;
import shop.sellution.server.auth.dto.response.RefreshAuthRes;
import shop.sellution.server.global.util.CookieUtil;
import shop.sellution.server.global.util.JWTUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.extractRefreshTokenFromCookie(request);
        RefreshAuthRes tokenResponse = authService.refreshToken(refreshToken);

        CookieUtil.addCookie(
                response,
                "refresh",
                tokenResponse.getRefreshToken(),
                (int) (JWTUtil.REFRESH_TOKEN_EXPIRE / 1000)
        );

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenResponse.getAccessToken())
                .body(Map.of("message", "Tokens refreshed successfully"));
    }
}
