package shop.sellution.server.product.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.*;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private ProductServiceImpl clientProductService;

    private Product product;
    private Category category;
    private Company company;
    private SaveProductReq saveProductReq;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        company = Company.builder().companyId(1L).build();
        category = Category.builder().name("Category").build();

        product = Product.builder()
                .code(1L)
                .name("Product Name")
                .category(category)
                .productInformation("Product Information")
                .cost(10000)
                .isDiscount(DisplayStatus.N)
                .discountStartDate(null)
                .discountEndDate(null)
                .discountRate(0)
                .discountedPrice(10000)
                .isVisible(DisplayStatus.Y)
                .deliveryType(DeliveryType.SUBSCRIPTION)
                .stock(100)
                .previousMonthSales(10)
                .company(company)
                .build();

        saveProductReq = SaveProductReq.builder()
                .name("Product Name")
                .categoryName("Category")
                .productInformation("Product Information")
                .cost(10000)
                .isDiscount(DisplayStatus.N)
                .discountStartDate(null)
                .discountEndDate(null)
                .discountRate(0)
                .thumbnailImage("thumbnail.jpg")
                .listImages(List.of("list1.jpg", "list2.jpg"))
                .detailImages(List.of("detail1.jpg", "detail2.jpg"))
                .isVisible(DisplayStatus.Y)
                .deliveryType(DeliveryType.SUBSCRIPTION)
                .stock(100)
                .companyId(1L)
                .build();
    }

    @DisplayName("모든 상품을 페이징 처리하여 조회")
    @Test
    void getAllProducts_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(product), pageable, 1));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(anyLong(), eq(ProductImageType.THUMBNAIL)))
                .thenReturn(List.of(ProductImage.builder().imageUrl("thumbnail.jpg").build()));

        Page<FindProductRes> result = clientProductService.getAllProducts(pageable);

        assertThat(result.getContent()).isNotEmpty();
        assertThat(result.getContent().get(0).getName()).isEqualTo("Product Name");
        verify(productRepository, times(1)).findAll(pageable);
    }

    @DisplayName("상품 ID로 상품을 조회한다.")
    @Test
    void getProductById_Success() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(anyLong(), eq(ProductImageType.THUMBNAIL)))
                .thenReturn(List.of(ProductImage.builder().imageUrl("thumbnail.jpg").build()));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(anyLong(), eq(ProductImageType.LIST)))
                .thenReturn(List.of(ProductImage.builder().imageUrl("list1.jpg").build(), ProductImage.builder().imageUrl("list2.jpg").build()));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(anyLong(), eq(ProductImageType.DETAILS)))
                .thenReturn(List.of(ProductImage.builder().imageUrl("detail1.jpg").build(), ProductImage.builder().imageUrl("detail2.jpg").build()));

        FindAllProductRes result = clientProductService.getProductById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Product Name");
        verify(productRepository, times(1)).findById(anyLong());
    }

    @DisplayName("상품을 생성한다.")
    @Test
    void createProduct_Success() {
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        clientProductService.createProduct(saveProductReq);

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @DisplayName("상품을 수정한다.")
    @Test
    void updateProduct_Success() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(category));

        clientProductService.updateProduct(1L, saveProductReq);

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @DisplayName("상품을 삭제한다.")
    @Test
    void deleteProduct_Success() {
        doNothing().when(productRepository).deleteById(anyLong());

        clientProductService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(anyLong());
    }
}
