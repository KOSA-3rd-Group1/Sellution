package shop.sellution.server.scheduler.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.scheduler.application.SchedulerService;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class SchedulerTestController {

    private final SchedulerService schedulerService;

    @PostMapping("scheduler")
    public void testScheduler() {
        schedulerService.regularProcessAt19();
        schedulerService.regularProcessAt0();
    }

    @GetMapping("/running")
    public String applicationIsRunning() {
        return "Success Application Running 네번째 테스트";
    }
}
