package shop.sellution.server.product.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.product.domain.*;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {

    private final CustomerProductRepositoryCustom customerProductRepositoryCustom;
    private final ProductImageRepository productImageRepository;
    private final CompanyRepository companyRepository;

    //1. All, EACH : 상품 테이블에서 is_visible이 Y인 상품 + deliveryType에 따라 전체 조회
    //1.1 카테고리 필터링
    //2. Category: 카테고리 테이블에서 is_visible이 Y인 카테고리에 속한 상품 + deliveryType에 따라 전체 조회
    //2.1 카테고리 필터링
    @Transactional(readOnly = true)
    @Override
    public Page<FindCustomerProductRes> findAllProducts(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable) {
        // companyId 예외처리
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        SellType sellType = company.getSellType();

        // sellType에 따른 조건별 조회 로직 구현
        List<Product> products;
        long total;

        if (sellType == SellType.CATEGORY) {
            products = customerProductRepositoryCustom.findByCategory(companyId, deliveryType, categoryId, pageable);
            total = customerProductRepositoryCustom.countByCategory(companyId, deliveryType, categoryId);
        } else {
            products = customerProductRepositoryCustom.findByAllOrEach(companyId, deliveryType, categoryId, pageable);
            total = customerProductRepositoryCustom.countByAllOrEach(companyId, deliveryType, categoryId);
        }

        List<FindCustomerProductRes> result = products.stream().map(product -> {
            String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL).stream()
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(null);
            return FindCustomerProductRes.fromEntity(product, thumbnailImage);
        }).toList();

        return new PageImpl<>(result, pageable, total);
    }

}
