package shop.sellution.server.product.domain;

import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.dto.response.FindProductRes;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, QuerydslPredicateExecutor<Product>,
        QuerydslBinderCustomizer<QProduct> {

    @Override
    default void customize(QuerydslBindings bindings, QProduct product) {
        bindings.bind(product.name).first((path, value) -> path.containsIgnoreCase(value));
        bindings.bind(product.deliveryType).first((path, value) -> path.eq(value));
        bindings.bind(product.isDiscount).first((path, value) -> path.eq(value));
        bindings.bind(product.category.name).first((path, value) -> path.eq(value));
        bindings.bind(product.isVisible).first((path, value) -> path.eq(value));

        bindings.excluding(product.productId, product.createdAt, product.updatedAt);
    }

    //Page<FindProductRes> getProductsByCompanyId(Long companyId, Pageable pageable, String deliveryType, String isDiscount, String categoryName, String isVisible, String productName);

    long countByCategoryCategoryId(Long categoryId);

    List<Product> findByCategoryCategoryId(Long categoryId);

    long countByCategoryName(@Param("categoryName") String categoryName);

    List<Product> findByProductIdIn(List<Long> productIds);

    // discountEndDate +1일이 오늘인 상품들 조회
    @Query("select p from Product p where p.discountEndDate = :date")
    List<Product> findDiscountEndDateIsToday(LocalDateTime date);

    List<Product> findByCompanyAndIsVisible(Company company, DisplayStatus isVisible);
}