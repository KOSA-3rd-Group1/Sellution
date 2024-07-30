package shop.sellution.server.event.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.event.application.EventService;
import shop.sellution.server.event.dto.request.SaveEventReq;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.event.dto.response.FindEventRes;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class EventController {
    private final EventService eventService;
    //고객 시점~
    @GetMapping
    public ResponseEntity<Page<FindEventRes>> findAllEvents(@RequestParam(required = false) LocalDate startDate,
                                                            @RequestParam(required = false) LocalDate endDate,
                                                            Pageable pageable) {
        //company id 받을 예정
        //Long companyId = 1L;
        Page<FindEventRes> result = eventService.findAllEvents(startDate, endDate, pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<String> saveEvent(@Valid @RequestBody SaveEventReq saveEventReq) {
        //Long companyId = 1L;
        eventService.saveEvent(saveEventReq);
        return ResponseEntity.ok("success");
    }
    @PutMapping("/{eventId}")
    public ResponseEntity<String> updateEvent(@PathVariable Long eventId, @Valid @RequestBody UpdateEventReq updateEventReq) {
        eventService.updateEvent(eventId, updateEventReq);
        return ResponseEntity.ok("success");
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok("success");
    }
    //회원 시점~
    //회원이 사이트에서 현재 진행중인 쿠폰 이벤트 조회 (회원 아니어도 조회는 가능)
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<FindEventRes>> findAllOngoingEvents(@PathVariable Long companyId) {
        List<FindEventRes> result = eventService.findAllOngoingEvents(companyId);
        return ResponseEntity.ok(result);
    }
    //회원이 자신의 쿠폰 목록 조회
    @Transactional(readOnly = true)
    @GetMapping("/coupons")
    public ResponseEntity<Page<FindEventRes>> findCoupons(Pageable pageable) {
        //회원 id 받을 예정
        //Long customerId = 1L;
        Page<FindEventRes> result = eventService.findCoupons(pageable);
        log.info("result: {}", result);
        return ResponseEntity.ok(result);
    }
    //회원이 쿠폰 다운로드 (회원만 가능)
    @PostMapping("/{eventId}/coupons")
    public ResponseEntity<String> saveCoupon(@PathVariable Long eventId) {
        //회원 id 받을 예정
        //Long customerId = 1L;
        eventService.saveCoupon(eventId);
        return ResponseEntity.ok("success");
    }

}
