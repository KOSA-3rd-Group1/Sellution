package shop.sellution.server.scheduler.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.scheduler.application.SchedulerService;

@RestController
@RequestMapping("test")
@RequiredArgsConstructor
public class SchedulerTestController {

    private final SchedulerService schedulerService;

    @PostMapping("scheduler")
    public void testScheduler() {
        schedulerService.regularProcess();
    }
}
