package pg.sellution.pgserver.test;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/running")
    public String applicationIsRunning() {
        return "Success PG-Application Running 두번째 테스트!";
    }
}
