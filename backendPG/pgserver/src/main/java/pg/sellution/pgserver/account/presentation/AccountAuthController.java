package pg.sellution.pgserver.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pg.sellution.pgserver.account.dto.request.CheckAccountReq;
import pg.sellution.pgserver.account.dto.response.CheckAccountRes;
import pg.sellution.pgserver.account.infrastructure.AccountAuthService;


@RestController
@RequestMapping("/pg/accounts/auth")
@RequiredArgsConstructor
public class AccountAuthController {

    private final AccountAuthService accountAuthService;

    @PostMapping("/check-account")
    public ResponseEntity<CheckAccountRes> checkAccount(@RequestBody CheckAccountReq req) {
        return ResponseEntity.ok(accountAuthService.checkAccount(req));

    }
}
