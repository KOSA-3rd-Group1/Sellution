package shop.sellution.server.payment.presentation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/payment")
public class PaymentController {

    @GetMapping("/test")
    public void test() {
        log.info("결제 로그 테스트");
    }
}
