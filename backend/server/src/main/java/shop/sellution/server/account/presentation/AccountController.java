package shop.sellution.server.account.presentation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.account.application.AccountService;
import shop.sellution.server.account.dto.request.SaveAccountReq;
import shop.sellution.server.account.dto.response.FindAccountRes;


@RequiredArgsConstructor
@RequestMapping("/accounts")
@RestController
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Page<FindAccountRes>> findAllAccountsByCustomerId(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @PathVariable("customerId") @Positive(message = "양수만 가능합니다.") Long customerId) {
        Page<FindAccountRes> result = accountService.findAllAccountsByCustomerId(customerId, pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers/{customerId}")
    public ResponseEntity<String> saveAccount(
            @PathVariable("customerId") @Positive(message = "양수만 가능합니다.") Long customerId,
            @RequestBody @Valid SaveAccountReq saveAccountReq
    ) {
        accountService.saveAccount(customerId, saveAccountReq);

        return ResponseEntity.ok("success");
    }
}
