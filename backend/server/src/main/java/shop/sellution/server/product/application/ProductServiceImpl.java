package shop.sellution.server.product.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductImage;
import shop.sellution.server.product.domain.ProductImageRepository;
import shop.sellution.server.product.domain.ProductImageType;
import shop.sellution.server.product.domain.ProductRepository;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;

    public ProductServiceImpl(ProductRepository productRepository, ProductImageRepository productImageRepository, CategoryRepository categoryRepository, CompanyRepository companyRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.categoryRepository = categoryRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public Page<FindProductRes> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(product -> {
                    String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL).stream()
                            .map(ProductImage::getImageUrl)
                            .findFirst()
                            .orElse(null);

                    return FindProductRes.fromEntity(product, thumbnailImage);
                });
    }

    @Override
    public FindAllProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.THUMBNAIL).stream()
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

        List<String> listImages = productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.LIST).stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        List<String> detailImages = productImageRepository.findByProductProductIdAndPurposeOfUse(productId, ProductImageType.DETAILS).stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return FindAllProductRes.fromEntity(product, thumbnailImage, listImages, detailImages);
    }

    @Override
    public void createProduct(SaveProductReq saveproductReq) {
        Company company = companyRepository.findById(saveproductReq.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Category category = null;
        if (saveproductReq.getCategoryName() != null) {
            category = categoryRepository.findByName(saveproductReq.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        long code = generateProductCode();
        int discountedPrice = calculateDiscountedPrice(saveproductReq.getCost(), saveproductReq.getDiscountRate());

        Product product = saveproductReq.toEntity(company, category, code, discountedPrice);
        productRepository.save(product);

        System.out.println("Saved Product ID: " + product.getProductId());
        System.out.println("Saved Product Code: " + product.getCode());

        saveProductImage(product, saveproductReq.getThumbnailImage(), ProductImageType.THUMBNAIL);
        saveProductImages(product, saveproductReq.getListImages(), ProductImageType.LIST);
        saveProductImages(product, saveproductReq.getDetailImages(), ProductImageType.DETAILS);
    }

    @Override
    public void updateProduct(Long productId, SaveProductReq productRequestDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = null;
        if (productRequestDTO.getCategoryName() != null) {
            category = categoryRepository.findByName(productRequestDTO.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        int discountedPrice = calculateDiscountedPrice(productRequestDTO.getCost(), productRequestDTO.getDiscountRate());
        productRequestDTO.updateEntity(product, category, discountedPrice);

        productRepository.save(product);

        saveProductImage(product, productRequestDTO.getThumbnailImage(), ProductImageType.THUMBNAIL);
        saveProductImages(product, productRequestDTO.getListImages(), ProductImageType.LIST);
        saveProductImages(product, productRequestDTO.getDetailImages(), ProductImageType.DETAILS);
    }



    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    private void saveProductImage(Product product, String imageUrl, ProductImageType type) {
        if (imageUrl != null) {
            Optional<ProductImage> existingImageOpt = productImageRepository.findByProductAndPurposeOfUse(product, type);
            if (existingImageOpt.isPresent()) {
                ProductImage existingImage = existingImageOpt.get();
                existingImage.setImageUrl(imageUrl);
                productImageRepository.save(existingImage);
            } else {
                ProductImage newImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(imageUrl)
                        .purposeOfUse(type)
                        .build();
                productImageRepository.save(newImage);
            }
        }

    }

    private void saveProductImages(Product product, List<String> imageUrls, ProductImageType type) {
        if (imageUrls != null) {
            List<ProductImage> productImages = imageUrls.stream()
                    .map(imageUrl -> ProductImage.builder()
                            .product(product)
                            .imageUrl(imageUrl)
                            .purposeOfUse(type)
                            .build())
                    .collect(Collectors.toList());
            productImageRepository.saveAll(productImages);
        }
    }

    private long generateProductCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = productRepository.count();
        long code = Long.parseLong(date + String.format("%06d", count + 1));
        System.out.println("Generated Product Code: " + code);
        return code;
    }

    private int calculateDiscountedPrice(int cost, int discountRate) {
        return cost - (cost * discountRate / 100);
    }
}
