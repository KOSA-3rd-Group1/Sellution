package shop.sellution.server.product.domain;

import aj.org.objectweb.asm.commons.Remapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;

@Repository
public interface CustomerProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCompanyIdAndDeliveryTypeAndCategoryId(Long companyId, DeliveryType deliveryType, Long categoryId);
    List<Product> findByCompanyIdAndDeliveryType(Long companyId, DeliveryType deliveryType);
}
