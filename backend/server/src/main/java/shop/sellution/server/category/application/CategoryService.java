package shop.sellution.server.category.application;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

public interface CategoryService {
    Page<FindCategoryRes> getAllCategories(Pageable pageable);
    FindCategoryRes getCategoryById(Long categoryId);
    void createCategory(SaveCategoryReq saveCategoryRequestDTO);
    void updateCategory(Long categoryId, SaveCategoryReq saveCategoryRequestDTO);
    void deleteCategory(Long categoryId);
    boolean isCategoryNameDuplicate(String name);

}
