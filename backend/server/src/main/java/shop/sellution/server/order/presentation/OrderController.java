package shop.sellution.server.order.presentation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    @GetMapping("/test")
    public void test() {
        log.error("주문 로그 테스트");
    }

}
