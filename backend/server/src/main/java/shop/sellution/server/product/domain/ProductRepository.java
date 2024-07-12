package shop.sellution.server.product.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    long countByCategoryCategoryId(Long categoryId);

    List<Product> findByCategoryCategoryId(Long categoryId);
    long countByCategoryName(@Param("categoryName") String categoryName);

}
