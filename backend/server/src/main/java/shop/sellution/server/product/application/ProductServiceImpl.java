package shop.sellution.server.product.application;

import com.querydsl.core.BooleanBuilder;
import lombok.extern.slf4j.Slf4j;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.category.domain.Category;
import shop.sellution.server.category.domain.CategoryRepository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.S3Service;
import shop.sellution.server.product.domain.Product;
import shop.sellution.server.product.domain.ProductImage;
import shop.sellution.server.product.domain.ProductImageRepository;
import shop.sellution.server.product.domain.ProductImageType;
import shop.sellution.server.product.domain.ProductRepository;
import shop.sellution.server.product.dto.request.SaveProductReq;
import shop.sellution.server.product.dto.response.FindAllProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static shop.sellution.server.product.domain.QProduct.product;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;
    private final S3Service s3Service;

    public ProductServiceImpl(ProductRepository productRepository, ProductImageRepository productImageRepository, CategoryRepository categoryRepository, CompanyRepository companyRepository, S3Service s3Service) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.categoryRepository = categoryRepository;
        this.companyRepository = companyRepository;
        this.s3Service = s3Service;
    }
    @Override
    @Transactional
    public Page<FindProductRes> getAllProducts(Long companyId, Pageable pageable, String deliveryType, String isDiscount, String categoryName, String isVisible, String productName) {
        BooleanBuilder builder = new BooleanBuilder();

        log.info("Fetching products with parameters - companyId: {}, deliveryType: {}, isDiscount: {}, categoryName: {}, isVisible: {}, productName: {}",
                companyId, deliveryType, isDiscount, categoryName, isVisible, productName);

        // 회사 ID로 필터링
        builder.and(product.company.companyId.eq(companyId));

        if (deliveryType != null && !deliveryType.equals("전체")) {
            builder.and(product.deliveryType.eq(DeliveryType.valueOf(deliveryType)));
        }
        if (isDiscount != null && !isDiscount.equals("전체")) {
            builder.and(product.isDiscount.eq(DisplayStatus.valueOf(isDiscount)));
        }
        if (categoryName != null && !categoryName.equals("전체")) {
            builder.and(product.category.name.eq(categoryName));
        }
        if (isVisible != null && !isVisible.equals("전체")) {
            builder.and(product.isVisible.eq(DisplayStatus.valueOf(isVisible)));
        }
        if (productName != null && !productName.isEmpty()) {
            builder.and(product.name.containsIgnoreCase(productName));
        }

        Page<Product> products = productRepository.findAll(builder, pageable);

        log.info("Products found: " + products.getTotalElements());

        return products.map(product -> {
            String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL)
                    .stream()
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(null);

            return FindProductRes.fromEntity(product, thumbnailImage);
        });
    }


    @Override
    @Transactional
    public FindAllProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_PRODUCT));

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
    @Transactional
    public void createProduct(SaveProductReq saveproductReq, MultipartFile thumbnailImage, List<MultipartFile> listImages, List<MultipartFile> detailImages) throws IOException {
        Company company = companyRepository.findById(saveproductReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        Category category = null;
        if (saveproductReq.getCategoryName() != null) {
            category = categoryRepository.findByName(saveproductReq.getCategoryName())
                    .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CATEGORY));
        }

        long code = generateProductCode();
        int discountedPrice = calculateDiscountedPrice(saveproductReq.getCost(), saveproductReq.getDiscountRate());

        Product product = saveproductReq.toEntity(company, category, code, discountedPrice);
        productRepository.save(product);

        System.out.println("Saved Product ID: " + product.getProductId());
        System.out.println("Saved Product Code: " + product.getCode());



        saveProductImage(product, thumbnailImage, ProductImageType.THUMBNAIL);
        saveProductImages(product, listImages, new ArrayList<>(), ProductImageType.LIST);
        saveProductImages(product, detailImages, new ArrayList<>(), ProductImageType.DETAILS);
    }

    @Override
    @Transactional
    public void updateProduct(Long productId, SaveProductReq saveProductReq, MultipartFile thumbnailImage, List<MultipartFile> listImages, List<MultipartFile> detailImages) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_PRODUCT));

        Category category = null;
        if (saveProductReq.getCategoryName() != null) {
            category = categoryRepository.findByName(saveProductReq.getCategoryName())
                    .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_CATEGORY));
        }

        int discountedPrice = calculateDiscountedPrice(saveProductReq.getCost(), saveProductReq.getDiscountRate());
        saveProductReq.updateEntity(product, category, discountedPrice);

        productRepository.save(product);

        // 썸네일 이미지 처리
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            saveProductImage(product, thumbnailImage, ProductImageType.THUMBNAIL);
        } else if (saveProductReq.getThumbnailImage() != null) {
            // 기존 썸네일 이미지 유지
            Optional<ProductImage> existingThumbnail = productImageRepository.findByProductAndPurposeOfUse(product, ProductImageType.THUMBNAIL);
            existingThumbnail.ifPresent(thumbnail -> thumbnail.setImageUrl(saveProductReq.getThumbnailImage()));
        }

        // 상품 이미지 처리
        List<String> remainingListImages = saveProductReq.getListImages() != null ? saveProductReq.getListImages() : new ArrayList<>();
        saveProductImages(product, listImages, remainingListImages, ProductImageType.LIST);

        // 상세 이미지 처리
        List<String> remainingDetailImages = saveProductReq.getDetailImages() != null ? saveProductReq.getDetailImages() : new ArrayList<>();
        saveProductImages(product, detailImages, remainingDetailImages, ProductImageType.DETAILS);
    }



    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_PRODUCT));

        List<ProductImage> images = productImageRepository.findByProductProductId(productId);
        for (ProductImage image : images) {
            s3Service.deleteFile(image.getImageUrl());
        }
        productImageRepository.deleteAll(images);

        // Delete the product
        productRepository.delete(product);
    }

    @Override
    public void deleteProducts(List<Long> ids) {
        for (Long productId : ids) {
            deleteProduct(productId);
        }
    }

    private void saveProductImage(Product product, MultipartFile imageFile, ProductImageType type) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3Service.uploadFile(imageFile, product.getCompany().getCompanyId(), "product", type);
            Optional<ProductImage> existingImageOpt = productImageRepository.findByProductAndPurposeOfUse(product, type);
            if (existingImageOpt.isPresent()) {
                ProductImage existingImage = existingImageOpt.get();
                s3Service.deleteFile(existingImage.getImageUrl());
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
    private void saveProductImages(Product product, List<MultipartFile> newImageFiles, List<String> remainingImageUrls, ProductImageType type) throws IOException {
        List<ProductImage> existingImages = productImageRepository.findAllByProductAndPurposeOfUse(product, type);

        // 남아있어야 할 이미지만 유지하고 나머지는 삭제
        for (ProductImage existingImage : existingImages) {
            if (!remainingImageUrls.contains(existingImage.getImageUrl())) {
                s3Service.deleteFile(existingImage.getImageUrl());
                productImageRepository.delete(existingImage);
            }
        }

        // 새로운 이미지 추가
        if (newImageFiles != null && !newImageFiles.isEmpty()) {
            for (MultipartFile imageFile : newImageFiles) {
                String imageUrl = s3Service.uploadFile(imageFile, product.getCompany().getCompanyId(), "product", type);
                ProductImage newImage = ProductImage.builder()
                        .product(product)
                        .imageUrl(imageUrl)
                        .purposeOfUse(type)
                        .build();
                productImageRepository.save(newImage);
            }
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