package pg.sellution.pgserver.payment.presentation;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pg.sellution.pgserver.account.dto.request.CheckAccountReq;
import pg.sellution.pgserver.account.infrastructure.AccountAuthService;
import pg.sellution.pgserver.auth.application.AccessTokenService;
import pg.sellution.pgserver.global.exception.AuthException;
import pg.sellution.pgserver.payment.dto.PaymentReq;

import static pg.sellution.pgserver.global.exception.ExceptionCode.INVALID_AUTH_HEADER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pg/pay")
@Slf4j
public class PaymentController {

    private final AccessTokenService accessTokenService;
    private final AccountAuthService accountAuthService;
    private static final String AUTH_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    @PostMapping("")
    public ResponseEntity<String> pay(@RequestBody PaymentReq paymentReq, HttpServletRequest request) {
        log.info("---------- 결제 시작 ----------");
        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            throw new AuthException(INVALID_AUTH_HEADER);
        }
        String token = authHeader.substring(TOKEN_PREFIX.length());
        accessTokenService.validateToken(token,"payment", paymentReq.getPrice(), getClientIp(request));
        accessTokenService.invalidateToken(token);

        accountAuthService.checkAccount(new CheckAccountReq(paymentReq.getBankCode(), paymentReq.getAccountNumber()));
        log.info("---------- 결제 종료 ----------");
        return ResponseEntity.ok().body("success");
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelPayment(@RequestBody PaymentReq paymentReq, HttpServletRequest request) {
        log.info("---------- 환불 시작---------- ");
        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            throw new AuthException(INVALID_AUTH_HEADER);
        }
        String token = authHeader.substring(TOKEN_PREFIX.length());
        accessTokenService.validateToken(token,"payment-cancel", paymentReq.getPrice(),getClientIp(request));
        accessTokenService.invalidateToken(token);

        accountAuthService.checkAccount(new CheckAccountReq(paymentReq.getBankCode(), paymentReq.getAccountNumber()));
        log.info("---------- 환불 종료 ----------");
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
