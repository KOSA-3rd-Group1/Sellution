package shop.sellution.server.product.domain;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

import static shop.sellution.server.category.domain.QCategory.category;
import static shop.sellution.server.product.domain.QProduct.product;

@Repository
@RequiredArgsConstructor
public class CustomerProductRepositoryImpl implements CustomerProductRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Product> findByCategory(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable) {
        return queryFactory.selectFrom(product)
                .join(product.category, category)
                .where(
                        product.company.companyId.eq(companyId),
                        category.isVisible.eq(DisplayStatus.Y),
//                        product.isVisible.eq(DisplayStatus.Y),
                        categoryId != null ? product.category.categoryId.eq(categoryId) : null, //categoryId가 주어진 경우, 해당 id와 일치하는 조건
                        deliveryType != null ? product.deliveryType.eq(deliveryType).or(product.deliveryType.eq(DeliveryType.BOTH)) : null //배달 유형이 주어진 경우 해당 배달 유형 or BOTH 와 일치하는 조건
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countByCategory(Long companyId, DeliveryType deliveryType, Long categoryId) {
        return queryFactory.selectFrom(product)
                .join(product.category, category)
                .where(
                        product.company.companyId.eq(companyId),
                        category.isVisible.eq(DisplayStatus.Y),
//                        product.isVisible.eq(DisplayStatus.Y),
                        categoryId != null ? product.category.categoryId.eq(categoryId) : null,
                        deliveryType != null ? product.deliveryType.eq(deliveryType).or(product.deliveryType.eq(DeliveryType.BOTH)) : null
                )
                .fetchCount();
    }

    @Override
    public List<Product> findByAllOrEach(Long companyId, DeliveryType deliveryType, Long categoryId, Pageable pageable) {
        return queryFactory.selectFrom(product)
                .where(
                        product.company.companyId.eq(companyId),
                        product.isVisible.eq(DisplayStatus.Y),
                        categoryId != null ? product.category.categoryId.eq(categoryId) : null,
                        deliveryType != null ? product.deliveryType.eq(deliveryType).or(product.deliveryType.eq(DeliveryType.BOTH)) : null
                )
                .offset(pageable.getOffset()) //결과의 시작 위치 지정
                .limit(pageable.getPageSize()) //한 번에 조회할 최대 결과 수
                .fetch(); //쿼리 실행 후 결과 가져오기
    }

    @Override
    public long countByAllOrEach(Long companyId, DeliveryType deliveryType, Long categoryId) {
        return queryFactory.selectFrom(product)
                .where(
                        product.company.companyId.eq(companyId),
                        product.isVisible.eq(DisplayStatus.Y),
                        categoryId != null ? product.category.categoryId.eq(categoryId) : null,
                        deliveryType != null ? product.deliveryType.eq(deliveryType).or(product.deliveryType.eq(DeliveryType.BOTH)) : null
                )
                .fetchCount(); //쿼리 실행 후 결과의 개수 반환
    }
}
