package shop.sellution.server.customer.domain.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.type.CustomerSortType;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.customer.dto.CustomerSearchCondition;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static shop.sellution.server.customer.domain.QCustomer.customer;

@Repository
@RequiredArgsConstructor
public class CustomerRepositoryCustomImpl implements CustomerRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Customer> findCustomerByCompanyIdAndCondition(Long companyId, CustomerSearchCondition condition, Pageable pageable) {

        List<Customer> content = queryFactory
                .selectFrom(customer)
                .where(
                        customer.company.companyId.eq(companyId),
                        usernameLike(condition.getCustomerUsername()),
                        nameLike(condition.getCustomerName()),
                        phoneNumberLike(condition.getCustomerPhoneNumber()),
                        typeEq(condition.getCustomerType()),
                        betweenDates(customer.createdAt, condition.getStartDate(), condition.getEndDate())
                )
                .orderBy(getSortedColumn(condition.getSortOption()))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(customer.count())
                .from(customer)
                .where(
                        customer.company.companyId.eq(companyId),
                        usernameLike(condition.getCustomerUsername()),
                        nameLike(condition.getCustomerName()),
                        phoneNumberLike(condition.getCustomerPhoneNumber()),
                        typeEq(condition.getCustomerType()),
                        betweenDates(customer.createdAt, condition.getStartDate(), condition.getEndDate())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression usernameLike(String username) {
        return username != null ? customer.username.like("%" + username + "%") : null;
    }

    private BooleanExpression nameLike(String name) {
        return name != null ? customer.name.like("%" + name + "%") : null;
    }

    private BooleanExpression phoneNumberLike(String phoneNumber) {
        return phoneNumber != null ? customer.phoneNumber.like("%" + phoneNumber + "%") : null;
    }

    private BooleanExpression typeEq(CustomerType type) {
        return type != null ? customer.type.eq(type) : null;
    }

    private BooleanExpression betweenDates(DateTimePath<LocalDateTime> datePath, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return datePath.between(
                    startDate.atStartOfDay(),
                    endDate.atTime(LocalTime.MAX)
            );
        }
        return null;
    }

    private OrderSpecifier<?> getSortedColumn(CustomerSortType sortOption) {
        if (sortOption != null) {
            switch (sortOption) {
                case CREATED_AT_ASC:
                    return customer.createdAt.asc();
                case CREATED_AT_DESC:
                    return customer.createdAt.desc();
                case LATEST_DELIVERY_DATE_ASC:
                    return customer.latestDeliveryDate.asc();
                case LATEST_DELIVERY_DATE_DESC:
                    return customer.latestDeliveryDate.desc();
            }
        }
        return customer.id.asc(); // 기본 정렬
    }
}
