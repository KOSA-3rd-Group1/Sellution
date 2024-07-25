package shop.sellution.server.order.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.order.application.OrderCreationService;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.order.dto.response.FindOrderRes;
import shop.sellution.server.sms.application.SmsServiceImpl;

@RestController
@Slf4j
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderCreationService orderCreationService;

    // 특정 회원의 주문 목록 조회
    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCustomerId(@PathVariable Long customerId, Pageable pageable) {

        return ResponseEntity.ok(orderService.findAllOrderByCustomerId(customerId,pageable));

    }
    // 특정 회사의 주문 목록 조회
    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCompanyId(
            @PathVariable Long companyId,
            OrderSearchCondition condition,
            Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.findAllOrderByCompanyId(companyId,condition,pageable));
    }

    // 주문하기
    @PostMapping("/customers/{customerId}")
    public ResponseEntity<String> order(@PathVariable Long customerId, @RequestBody SaveOrderReq saveOrderReq) {
        long savedOrderId = orderCreationService.createOrder(customerId, saveOrderReq);
        return ResponseEntity.ok().body("success, 생성된 아이디 : " + savedOrderId);
    }

    // 주문 취소하기
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId, @RequestBody CancelOrderReq cancelOrderReq) {
        orderService.cancelOrder(orderId,cancelOrderReq);
        return ResponseEntity.ok().body("success");
    }

    // 주문 수동 승인
    @PostMapping("/{orderId}/approve")
    public ResponseEntity<String> approveOrder(@PathVariable Long orderId) {
        orderService.approveOrder(orderId);
        return ResponseEntity.ok().body("success");
    }

    // 주문 자동 승인 토글
    @PostMapping("/auto-approve-toggle/company/{companyId}")
    public ResponseEntity<String> autoApproveOrder(@PathVariable Long companyId) {
        orderService.toggleAutoApprove(companyId);
        return ResponseEntity.ok().body("success");
    }

    // 주문 상세조회
    @GetMapping("/{orderId}")
    public ResponseEntity<FindOrderRes> findOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.findOrder(orderId));
    }


}
