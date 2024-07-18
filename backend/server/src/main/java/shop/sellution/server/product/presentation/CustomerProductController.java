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
@RequestMapping("/products/company/{name}")
@RequiredArgsConstructor
public class CustomerProductController {
    private final CustomerProductService customerProductService;
    @GetMapping()
    public ResponseEntity<Page<FindCustomerProductRes>> findAllProducts(@PathVariable String name, //name에서 companyId 추출
                                                                        @RequestParam(value="deliveryType", required = true) DeliveryType deliveryType,
                                                                        @RequestParam(value="categoryId", required = false) Long categoryId,
                                                                        Pageable pageable){
        return ResponseEntity.ok(customerProductService.findAllProducts(name, deliveryType, categoryId, pageable));
    }

    //상세조회는 다른 ProductController에서 구현

}
