package shop.sellution.server.category.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.S3Service;
import shop.sellution.server.product.domain.ProductRepository;
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    @Override
    public Page<FindCategoryRes> getAllCategories(Long companyId, DisplayStatus isVisible, Pageable pageable) {
        log.info("Fetching categories for companyId: {}, isVisible: {}, page: {}, size: {}",
                companyId, isVisible, pageable.getPageNumber(), pageable.getPageSize());

        Page<Category> categories = categoryRepository.findByCompanyCompanyIdAndIsVisible(companyId, isVisible, pageable);

        log.info("Found {} categories for companyId: {}, isVisible: {}", categories.getTotalElements(), companyId, isVisible);

        return categories.map(category -> {
            int productCount = (int) productRepository.countByCategoryCategoryId(category.getCategoryId());
            return FindCategoryRes.fromEntity(category, productCount);
        });
    }

    @Transactional(readOnly = true)
    @Override
    public FindCategoryRes getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CATEGORY));
        int productCount = (int) productRepository.countByCategoryCategoryId(categoryId);
        return FindCategoryRes.fromEntity(category, productCount);
    }

    @Override
    public boolean isCategoryNameDuplicate(String name) {
        return categoryRepository.findByName(name).isPresent();
    }

    @Override
    public void createCategory(SaveCategoryReq saveCategoryReq) {
        Company company = companyRepository.findById(saveCategoryReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        Category category = saveCategoryReq.toEntity(company);
        category.setIsVisible(DisplayStatus.Y);
        category.setProductCount(0);
        categoryRepository.save(category);
    }

    @Override
    public void updateCategory(Long categoryId, SaveCategoryReq saveCategoryReq) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CATEGORY));
        saveCategoryReq.updateEntity(category);
        categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
