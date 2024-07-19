package shop.sellution.server.product.domain;

import org.springframework.data.domain.Pageable;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;

public interface CustomerProductRepositoryCustom {
    List<Product> findByCategory(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable);

    long countByCategory(Long companyId, DeliveryType deliveryType, Long categoryId);

    List<Product> findByAllOrEach(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable);

    long countByAllOrEach(Long companyId, DeliveryType deliveryType, Long categoryId);
}
