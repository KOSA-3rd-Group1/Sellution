package shop.sellution.server.order.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.order.application.OrderCreationService;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CalculateReq;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.order.dto.response.CalculateRes;
import shop.sellution.server.order.dto.response.FindOrderRes;

@RestController
@Slf4j
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderCreationService orderCreationService;

    // 특정 회원의 주문 목록 조회
    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCustomerId(
            @PathVariable Long customerId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(orderService.findAllOrderByCustomerId(customerId,pageable));

    }
    // 특정 회사의 주문 목록 조회
    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCompanyId(
            @PathVariable Long companyId,
            OrderSearchCondition condition,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.findAllOrderByCompanyId(companyId,condition,pageable));
    }

    // 주문하기
    @PostMapping("/customers/{customerId}")
    public ResponseEntity<String> order(@PathVariable Long customerId, @RequestBody SaveOrderReq saveOrderReq) {
        long savedOrderId = orderCreationService.createOrder(customerId, saveOrderReq);
        return ResponseEntity.ok().body("success, 생성된 주문 아이디 : " + savedOrderId);
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

    // 정기주문(월)화면에 필요한 가격정보 조회
    @PostMapping("/month/calculate-price")
    public ResponseEntity<CalculateRes> calculatePrice(@RequestBody CalculateReq calculateReq) {
        return ResponseEntity.ok(orderService.calculatePrice(calculateReq));
    }

    // 정기주문(횟수)화면에 필요한 정보 조회
    @PostMapping("/count/info")
    public ResponseEntity<CalculateRes> getCountOrderDeliveryInfo(@RequestBody CalculateReq calculateReq) {
        return ResponseEntity.ok(orderService.calculatePrice(calculateReq));
    }

    // 해당 주문의 재고가 충분한지 체크 하는 API
    @GetMapping("/{orderId}/enough-stock")
    public ResponseEntity<String> checkStock(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.checkStock(orderId) ? "true" : "false");
    }

    // 해당 회사의 주문들중 승인안된 주문 건수 조회
    @GetMapping("/company/{companyId}/unapproved-count")
    public ResponseEntity<Long> getUnapprovedOrderCount(@PathVariable Long companyId) {
        return ResponseEntity.ok(orderService.getUnapprovedOrderCount(companyId));
    }


}
