//package shop.sellution.server.category.application;
//
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import shop.sellution.server.category.domain.Category;
//import shop.sellution.server.category.domain.CategoryRepository;
//import shop.sellution.server.category.dto.request.SaveCategoryReq;
//import shop.sellution.server.category.dto.response.FindCategoryRes;
//import shop.sellution.server.global.type.DisplayStatus;
//import shop.sellution.server.product.domain.ProductRepository;
//
//import java.util.Collections;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//class CategoryServiceImplTest {
//
//    @Mock
//    private CategoryRepository categoryRepository;
//
//    @Mock
//    private ProductRepository productRepository;
//
//    @InjectMocks
//    private CategoryServiceImpl categoryService;
//
//    private Category category;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        category = Category.builder()
//                .categoryId(1L)
//                .name("TestCategory")
//                .isVisible(DisplayStatus.Y)
//                .productCount(0)
//                .build();
//    }
//
//    @Test
//    void testGetAllCategories() {
//        Pageable pageable = PageRequest.of(0, 10);
//        Page<Category> categoryPage = new PageImpl<>(Collections.singletonList(category));
//        when(categoryRepository.findAll(pageable)).thenReturn(categoryPage);
//        when(productRepository.countByCategoryCategoryId(any(Long.class))).thenReturn(5L);
//
//        Page<FindCategoryRes> result = categoryService.getAllCategories(pageable);
//
//        assertThat(result.getContent()).hasSize(1);
//        verify(categoryRepository, times(1)).findAll(pageable);
//    }
//
//    @Test
//    void testGetCategoryById() {
//        when(categoryRepository.findById(any(Long.class))).thenReturn(Optional.of(category));
//        when(productRepository.countByCategoryCategoryId(any(Long.class))).thenReturn(5L);
//
//        FindCategoryRes result = categoryService.getCategoryById(1L);
//
//        assertThat(result).isNotNull();
//        assertThat(result.getName()).isEqualTo("TestCategory");
//        verify(categoryRepository, times(1)).findById(1L);
//    }
//
//    @Test
//    void testCreateCategory() {
//        SaveCategoryReq requestDTO = SaveCategoryReq.builder()
//                .name("TestCategory")
//                .build();
//
//        categoryService.createCategory(requestDTO);
//
//        verify(categoryRepository, times(1)).save(any(Category.class));
//    }
//
//    @Test
//    void testUpdateCategory() {
//        SaveCategoryReq requestDTO = SaveCategoryReq.builder()
//                .name("UpdatedCategory")
//                .build();
//        when(categoryRepository.findById(any(Long.class))).thenReturn(Optional.of(category));
//
//        categoryService.updateCategory(1L, requestDTO);
//
//        verify(categoryRepository, times(1)).findById(1L);
//        verify(categoryRepository, times(1)).save(any(Category.class));
//    }
//
//    @Test
//    void testDeleteCategory() {
//        doNothing().when(categoryRepository).deleteById(any(Long.class));
//
//        categoryService.deleteCategory(1L);
//
//        verify(categoryRepository, times(1)).deleteById(1L);
//    }
//}
