package shop.sellution.server.category.domain;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.product.domain.QProduct;

import java.util.List;

@Repository
public class CategoryRepositoryImpl implements CategoryRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Autowired
    public CategoryRepositoryImpl(EntityManager em){
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<Category> findByIsVisibleAndDeliveryType(DisplayStatus isVisible, DeliveryType deliveryType, Pageable pageable) {
        QCategory category = QCategory.category;
        QProduct product = QProduct.product;

        List<Category> categories = queryFactory
                .select(category)
                .from(product)
                .join(product.category, category)
                .where(product.isVisible.eq(isVisible)
                        .and(product.deliveryType.eq(deliveryType)))
                .distinct()
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(category)
                .from(product)
                .join(product.category, category)
                .where(product.isVisible.eq(isVisible)
                        .and(product.deliveryType.eq(deliveryType)))
                .distinct()
                .fetchCount();

        return new PageImpl<>(categories, pageable, total);
    }
}
