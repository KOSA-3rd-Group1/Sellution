package shop.sellution.server.account.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.account.infrastructure.AccountAuthService;

@RestController
@RequestMapping("/accounts/auth")
@RequiredArgsConstructor
public class AccountAuthController {

    private final AccountAuthService accountAuthService;

    @PostMapping("/check-account")
    public Mono<ResponseEntity<CheckAccountRes>> checkAccount(@RequestBody CheckAccountReq req) {
        return accountAuthService.checkAccount(req) // 비동기로 계좌를 확인합니다.
                .map(ResponseEntity::ok); // 결과를 ResponseEntity로 래핑합니다.
    }
}
