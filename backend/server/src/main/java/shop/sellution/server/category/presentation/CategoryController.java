package shop.sellution.server.category.presentation;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.category.application.CategoryServiceImpl;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryServiceImpl categoryService;

    public CategoryController(CategoryServiceImpl categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<Page<FindCategoryRes>> getAllCategories(@RequestParam Long companyId, Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategories(companyId,pageable));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<FindCategoryRes> getCategoryById(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkCategoryNameDuplicate(@RequestParam String name) {
        boolean isDuplicate = categoryService.isCategoryNameDuplicate(name);
        return ResponseEntity.ok(isDuplicate);
    }

    @PostMapping
    public ResponseEntity<Void> createCategory(@Valid @RequestBody SaveCategoryReq saveCategoryReq) {
        categoryService.createCategory(saveCategoryReq);
        return ResponseEntity.status(201).build(); // 201 Created
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<Void> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody SaveCategoryReq saveCategoryReq) {
        categoryService.updateCategory(categoryId, saveCategoryReq);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

}
