package pg.sellution.pgserver.payment.presentation;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/pg")
public class PaymentController {

    private final AccessTokenService accessTokenService;
    private final AccountAuthService accountAuthService;
    private static final String AUTH_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    @PostMapping("/pay")
    public ResponseEntity<String> pay(@RequestBody PaymentReq paymentReq, HttpServletRequest request) {
        accountAuthService.checkAccount(new CheckAccountReq(paymentReq.getBankCode(), paymentReq.getAccountNumber()));

        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            throw new AuthException(INVALID_AUTH_HEADER);
        }

        String token = authHeader.substring(TOKEN_PREFIX.length());
        accessTokenService.validateToken(token,"payment", paymentReq.getPrice(), request.getRemoteAddr());
        accessTokenService.invalidateToken(token);
        return ResponseEntity.ok().body("success");
    }
}
