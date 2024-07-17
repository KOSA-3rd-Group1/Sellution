package shop.sellution.server.product.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.product.domain.*;
import shop.sellution.server.product.dto.response.FindCustomerProductRes;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {

    private final CustomerProductRepository customerProductRepository;
    private final ProductImageRepository productImageRepository;
    private final CompanyRepository companyRepository;


    @Override
    public List<FindCustomerProductRes> findAllProducts(String shopUrl, DeliveryType deliveryType, Long categoryId) {
        Long companyId = companyRepository.findCompanyIdByShopUrl(shopUrl)
                .orElseThrow(() -> new IllegalArgumentException("Company not found for shopUrl: " + shopUrl))
                .getCompanyId(); //예외처리 하기
        if (categoryId != null) {
            return customerProductRepository.findByCompanyIdAndDeliveryTypeAndCategoryId(companyId, deliveryType, categoryId).stream()
                    .map(product -> {
                        String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL).stream()
                                .map(ProductImage::getImageUrl)
                                .findFirst()
                                .orElse(null);
                        FindCustomerProductRes findCustomerProductRes = FindCustomerProductRes.fromEntity(product, thumbnailImage);
                        reuturn  findCustomerProductRes;
                    }).toList();
        } else {
            return customerProductRepository.findByCompanyIdAndDeliveryType(companyId, deliveryType).stream()
                    .map(product -> {
                        String thumbnailImage = productImageRepository.findByProductProductIdAndPurposeOfUse(product.getProductId(), ProductImageType.THUMBNAIL).stream()
                                .map(ProductImage::getImageUrl)
                                .findFirst()
                                .orElse(null);
                        FindCustomerProductRes.fromEntity(product, thumbnailImage);
                    })
                    .toList();
        }


    }
}
