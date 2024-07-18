package shop.sellution.server.category.domain;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

import static shop.sellution.server.category.domain.QCategory.category;
import static shop.sellution.server.product.domain.QProduct.product;

@Repository
@RequiredArgsConstructor
public class CustomerCategoryRepositoryImpl implements CustomerCategoryRepositoryCustom{
    private final JPAQueryFactory queryFactory;
    @Override
    public List<Category> findAllCategories(Long companyId, DisplayStatus displayStatus) {
        return queryFactory.selectFrom(category)
                .join(product).on(product.category.eq(category))
                .where(
                        product.company.companyId.eq(companyId),
                        category.isVisible.eq(displayStatus)
                )
                .distinct()
                .fetch();

    }
}
