package shop.sellution.server.product.application;

import com.querydsl.core.BooleanBuilder;
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
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.S3Service;
import shop.sellution.server.product.domain.*;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.io.IOException;
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

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private ProductServiceImpl productService;

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
                .productId(1L)
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
        Long companyId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        String deliveryType = "전체";
        String isDiscount = "전체";
        String categoryName = "전체";
        String isVisible = "전체";
        String productName = "";

        when(productRepository.findAll(any(BooleanBuilder.class), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(product), pageable, 1));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(anyLong(), eq(ProductImageType.THUMBNAIL)))
                .thenReturn(List.of(ProductImage.builder().imageUrl("thumbnail.jpg").build()));

        Page<FindProductRes> result = productService.getAllProducts(companyId, pageable, deliveryType, isDiscount, categoryName, isVisible, productName);

        assertThat(result.getContent()).isNotEmpty();
        assertThat(result.getContent().get(0).getName()).isEqualTo("Product Name");
        verify(productRepository, times(1)).findAll(any(BooleanBuilder.class), eq(pageable));
    }

    @DisplayName("상품 ID로 상품을 조회한다.")
    @Test
    void getProductById_Success() {
        // Given
        Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.THUMBNAIL))
                .thenReturn(List.of(ProductImage.builder().imageUrl("thumbnail.jpg").build()));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.LIST))
                .thenReturn(List.of(ProductImage.builder().imageUrl("list1.jpg").build(), ProductImage.builder().imageUrl("list2.jpg").build()));
        when(productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.DETAILS))
                .thenReturn(List.of(ProductImage.builder().imageUrl("detail1.jpg").build(), ProductImage.builder().imageUrl("detail2.jpg").build()));

        // When
        FindAllProductRes result = productService.getProductById(productId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Product Name");
        assertThat(result.getProductId()).isEqualTo(productId);
        verify(productRepository, times(1)).findById(productId);
    }


    @DisplayName("상품을 생성한다.")
    @Test
    void createProduct_Success() throws IOException {
        when(companyRepository.findById(anyLong())).thenReturn(Optional.of(company));
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(s3Service.uploadFile(any(MultipartFile.class), anyLong(), anyString(), any(ProductImageType.class))).thenReturn("image_url");

        productService.createProduct(saveProductReq, mock(MultipartFile.class), List.of(mock(MultipartFile.class)), List.of(mock(MultipartFile.class)));

        verify(productRepository, times(1)).save(any(Product.class));
        verify(productImageRepository, atLeastOnce()).save(any(ProductImage.class));
    }

    @DisplayName("상품을 수정한다.")
    @Test
    void updateProduct_Success() throws IOException {
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(category));
        when(s3Service.uploadFile(any(MultipartFile.class), anyLong(), anyString(), any(ProductImageType.class))).thenReturn("image_url");

        productService.updateProduct(1L, saveProductReq, mock(MultipartFile.class), List.of(mock(MultipartFile.class)), List.of(mock(MultipartFile.class)));

        verify(productRepository, times(1)).save(any(Product.class));
        verify(productImageRepository, atLeastOnce()).save(any(ProductImage.class));
    }

    @DisplayName("상품을 삭제한다.")
    @Test
    void deleteProduct_Success() {
        long productId = 1L;
        List<ProductImage> images = List.of(
                ProductImage.builder().imageUrl("image1.jpg").build(),
                ProductImage.builder().imageUrl("image2.jpg").build()
        );

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productImageRepository.findByProductProductId(productId)).thenReturn(images);
        doNothing().when(s3Service).deleteFile(anyString());
        doNothing().when(productImageRepository).deleteAll(anyList());
        doNothing().when(productRepository).delete(any(Product.class));

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).findById(productId);
        verify(productImageRepository, times(1)).findByProductProductId(productId);
        verify(s3Service, times(2)).deleteFile(anyString());
        verify(productImageRepository, times(1)).deleteAll(images);
        verify(productRepository, times(1)).delete(product);
    }

    @DisplayName("여러 상품을 삭제한다.")
    @Test
    void deleteProducts_Success() {
        List<Long> productIds = List.of(1L, 2L, 3L);

        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        when(productImageRepository.findByProductProductId(anyLong())).thenReturn(List.of(
                ProductImage.builder().imageUrl("image1.jpg").build(),
                ProductImage.builder().imageUrl("image2.jpg").build()
        ));

        productService.deleteProducts(productIds);

        verify(productRepository, times(3)).findById(anyLong());
        verify(productImageRepository, times(3)).findByProductProductId(anyLong());
        verify(s3Service, atLeast(3)).deleteFile(anyString());
        verify(productImageRepository, times(3)).deleteAll(anyList());
        verify(productRepository, times(3)).delete(any(Product.class));
    }
}