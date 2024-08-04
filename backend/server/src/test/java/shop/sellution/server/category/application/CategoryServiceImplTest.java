package shop.sellution.server.category.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.ProductRepository;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;
    private Company company;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        company = Company.builder()
                .companyId(1L)
                .name("TestCompany")
                .build();
        category = Category.builder()
                .categoryId(1L)
                .name("TestCategory")
                .isVisible(DisplayStatus.Y)
                .productCount(0)
                .company(company)
                .build();
    }

    @Test
    void testGetAllCategories() {
        Long companyId = 1L;
        DisplayStatus isVisible = DisplayStatus.Y;
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> categoryPage = new PageImpl<>(Collections.singletonList(category));
        when(categoryRepository.findByCompanyCompanyIdAndIsVisible(companyId, isVisible, pageable)).thenReturn(categoryPage);
        when(productRepository.countByCategoryCategoryId(any(Long.class))).thenReturn(5L);

        Page<FindCategoryRes> result = categoryService.getAllCategories(companyId, isVisible, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(categoryRepository, times(1)).findByCompanyCompanyIdAndIsVisible(companyId, isVisible, pageable);
    }

    @Test
    void testGetCategoryById() {
        when(categoryRepository.findById(any(Long.class))).thenReturn(Optional.of(category));
        when(productRepository.countByCategoryCategoryId(any(Long.class))).thenReturn(5L);

        FindCategoryRes result = categoryService.getCategoryById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("TestCategory");
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void testIsCategoryNameDuplicate() {
        String categoryName = "TestCategory";
        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.of(category));

        boolean result = categoryService.isCategoryNameDuplicate(categoryName);

        assertThat(result).isTrue();
        verify(categoryRepository, times(1)).findByName(categoryName);
    }

    @Test
    void testCreateCategory() {
        SaveCategoryReq requestDTO = SaveCategoryReq.builder()
                .name("TestCategory")
                .companyId(1L)
                .build();
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        categoryService.createCategory(requestDTO);

        verify(companyRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testCreateCategory_CompanyNotFound() {
        SaveCategoryReq requestDTO = SaveCategoryReq.builder()
                .name("TestCategory")
                .companyId(1L)
                .build();
        when(companyRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> categoryService.createCategory(requestDTO));

        verify(companyRepository, times(1)).findById(1L);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void testUpdateCategory() {
        SaveCategoryReq requestDTO = SaveCategoryReq.builder()
                .name("UpdatedCategory")
                .companyId(1L)
                .build();
        when(categoryRepository.findById(any(Long.class))).thenReturn(Optional.of(category));

        categoryService.updateCategory(1L, requestDTO);

        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testDeleteCategory() {
        doNothing().when(categoryRepository).deleteById(any(Long.class));

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).deleteById(1L);
    }
}