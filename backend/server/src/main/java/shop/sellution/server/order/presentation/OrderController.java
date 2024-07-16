package shop.sellution.server.order.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.dto.response.FindOrderRes;

@RestController
@Slf4j
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCustomerId(@PathVariable Long customerId, Pageable pageable) {

        return ResponseEntity.ok(orderService.findAllOrderByCustomerId(customerId,pageable));

    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<FindOrderRes>> findAllOrderByCompanyId(@PathVariable Long companyId, Pageable pageable) {

        return ResponseEntity.ok(orderService.findAllOrderByCompanyId(companyId,pageable));

    }

}
