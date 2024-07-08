package shop.sellution.server.account.customer.presentation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/accounts")
public class CustomerAccountController {

    @GetMapping("/test")
    public void test() {
        log.info("결제 로그 테스트");

    }
}
