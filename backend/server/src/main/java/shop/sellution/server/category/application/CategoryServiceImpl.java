package shop.sellution.server.category.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.category.domain.CategoryRepositoryCustom;
import shop.sellution.server.category.domain.CategoryRepositoryImpl;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.ProductRepository;

@Transactional
@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryRepositoryCustom categoryRepositoryCustom;
    private final ProductRepository productRepository;

//    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryRepositoryCustom categoryRepositoryCustom, ProductRepository productRepository) {
//        this.categoryRepository = categoryRepository;
//        this.categoryRepositoryCustom = categoryRepositoryCustom;
//        this.productRepository = productRepository;
//    }
    @Transactional(readOnly = true)
    @Override
    public Page<FindCategoryRes> getAllCategories(DisplayStatus isVisible, DeliveryType deliveryType, Pageable pageable) {
        Page<Category> categories;

        if (isVisible != null && deliveryType != null) {
            categories = categoryRepositoryCustom.findByIsVisibleAndDeliveryType(isVisible, deliveryType, pageable);
        } else if (isVisible != null) {
            categories = null;
        } else if (deliveryType != null) {
            categories = null;
        } else {
            categories = categoryRepository.findAll(pageable);
        }

        return categories.map(category -> {
            int productCount = (int) productRepository.countByCategoryCategoryId(category.getCategoryId());
            return FindCategoryRes.fromEntity(category, productCount);
        });
//        return categoryRepository.findAll(pageable)
//                .map(category -> {
//                    int productCount = (int) productRepository.countByCategoryCategoryId(category.getCategoryId());
//                    return FindCategoryRes.fromEntity(category, productCount);
//                });
    }
    @Transactional(readOnly = true)
    @Override
    public FindCategoryRes getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        int productCount = (int) productRepository.countByCategoryCategoryId(categoryId);
        return FindCategoryRes.fromEntity(category, productCount);
    }

    @Override
    public void createCategory(SaveCategoryReq saveCategoryReq) {
        Category category = saveCategoryReq.toEntity();
        category.setIsVisible(DisplayStatus.Y);
        category.setProductCount(0);
        categoryRepository.save(category);
    }

    @Override
    public void updateCategory(Long categoryId, SaveCategoryReq saveCategoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        saveCategoryReq.updateEntity(category);
        categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
