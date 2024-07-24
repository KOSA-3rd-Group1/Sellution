package shop.sellution.server.category.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.category.application.CustomerCategoryService;
import shop.sellution.server.category.dto.response.FindCustomerCategoryRes;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.application.CustomerProductService;

import java.util.List;

@RestController
@RequestMapping("/categories/company/{companyId}")
@RequiredArgsConstructor
public class CustomerCategoryController {
    private final CustomerCategoryService customerCategoryService;
    @GetMapping
    public ResponseEntity<List<FindCustomerCategoryRes>> findALlCategories(@PathVariable Long companyId){
        return ResponseEntity.ok(customerCategoryService.findAllCategories(companyId));
    }
}
