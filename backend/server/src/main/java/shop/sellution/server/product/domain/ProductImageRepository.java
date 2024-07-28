package shop.sellution.server.product.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductProductId(Long productId);
    Optional<ProductImage> findByProductAndPurposeOfUse(Product product, ProductImageType purposeOfUse);
    List<ProductImage> findByProductProductIdAndPurposeOfUse(Long productId, ProductImageType purposeOfUse);
    List<ProductImage> findAllByProductAndPurposeOfUse(Product product, ProductImageType purposeOfUse);

    @Query("""
    select pi from ProductImage pi
    where pi.product.productId in :productIds
    """)
    List<ProductImage> findAllByProductIdIn(@Param("productIds") List<Long> productIds);
}
