package shop.sellution.server.product.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.product.application.CustomerProductService;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;

import java.util.List;

@RestController
@RequestMapping("/products/company")
@RequiredArgsConstructor
public class CustomerProductController {
    private final CustomerProductService customerProductService;
    @GetMapping("/{companyId}")
    public ResponseEntity<Page<FindCustomerProductRes>> findAllProducts(@PathVariable Long companyId,
                                                                        @RequestParam(value="deliveryType", required = true) DeliveryType deliveryType,
                                                                        @RequestParam(value="categoryId", required = false) Long categoryId,
                                                                        Pageable pageable){
        return ResponseEntity.ok(customerProductService.findAllProducts(companyId, deliveryType, categoryId, pageable));
    }

}
