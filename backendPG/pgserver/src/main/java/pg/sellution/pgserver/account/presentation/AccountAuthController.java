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
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/pg/accounts/auth")
@RequiredArgsConstructor
public class AccountAuthController {

    private final AccountAuthService accountAuthService;

    @PostMapping("/check-account")
    public Mono<ResponseEntity<CheckAccountRes>> checkAccount(@RequestBody CheckAccountReq req) {
        return accountAuthService.checkAccount(req) // 비동기로 계좌를 확인합니다.
                .map(ResponseEntity::ok); // 결과를 ResponseEntity로 래핑합니다.
    }
}
