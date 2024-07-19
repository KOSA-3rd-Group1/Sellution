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
import shop.sellution.server.order.dto.request.SaveOrderReq;
import shop.sellution.server.order.dto.response.FindOrderRes;

@RestController
@Slf4j
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderCreationService orderCreationService;

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCustomerId(@PathVariable Long customerId, Pageable pageable) {

        return ResponseEntity.ok(orderService.findAllOrderByCustomerId(customerId,pageable));

    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCompanyId(
            @PathVariable Long companyId,
            OrderSearchCondition condition,
            Pageable pageable
    ) {

        return ResponseEntity.ok(orderService.findAllOrderByCompanyId(companyId,condition,pageable));

    }

    @PostMapping("/customers/{customerId}")
    public ResponseEntity<String> order(@PathVariable Long customerId, @RequestBody SaveOrderReq saveOrderReq) {
        orderCreationService.createOrder(customerId,saveOrderReq);
        return ResponseEntity.ok().body("success");
    }

}
