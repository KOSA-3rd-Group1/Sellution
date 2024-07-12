package shop.sellution.server.category.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.ProductRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Page<FindCategoryRes> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(category -> {
                    int productCount = (int) productRepository.countByCategoryCategoryId(category.getCategoryId());
                    return FindCategoryRes.fromEntity(category, productCount);
                });
    }

    @Override
    public FindCategoryRes getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        int productCount = (int) productRepository.countByCategoryCategoryId(categoryId);
        return FindCategoryRes.fromEntity(category, productCount);
    }

    @Override
    @Transactional
    public void createCategory(SaveCategoryReq saveCategoryReq) {
        Category category = saveCategoryReq.toEntity();
        category.setIsVisible(DisplayStatus.Y);
        category.setProductCount(0);
        categoryRepository.save(category);
    }

    @Override
    @Transactional
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
