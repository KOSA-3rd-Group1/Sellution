package pg.sellution.pgserver.auth.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pg.sellution.pgserver.auth.application.AccessTokenService;
import pg.sellution.pgserver.auth.dto.request.CreateTokenReq;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/pg")
public class AuthController {

    private final AccessTokenService accessTokenService;
    private static final String AUTH_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    @PostMapping("/get-token")
    public ResponseEntity<String> createAccessToken(
            @RequestBody CreateTokenReq createTokenReq,
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        String clientIP = getClientIp(request);

        String token = accessTokenService.generateToken(
                createTokenReq.getName(),
                createTokenReq.getApiKey(),
                createTokenReq.getPermission(),
                createTokenReq.getPrice(),
                clientIP
        );

        log.info("Access token created for API key: {}, IP: {}", createTokenReq.getApiKey(), clientIP);

        response.addHeader(AUTH_HEADER, TOKEN_PREFIX + token);

        return ResponseEntity.ok().body("success");
    }

    private String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("WL-Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }
}