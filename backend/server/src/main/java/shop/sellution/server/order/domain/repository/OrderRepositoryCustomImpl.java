package shop.sellution.server.order.domain.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.domain.type.OrderType;
import shop.sellution.server.order.dto.OrderSearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static shop.sellution.server.order.domain.QOrder.order;
import static shop.sellution.server.customer.domain.QCustomer.customer;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Order> findOrderByCompanyIdAndCondition(Long companyId, OrderSearchCondition condition, Pageable pageable) {
        List<Order> content = queryFactory
                .selectFrom(order)
                .leftJoin(order.customer, customer).fetchJoin()
                .where(
                        order.company.companyId.eq(companyId),
                        orderCodeLike(condition.getOrderCode()),
                        orderTypeEq(condition.getOrderType()),
                        customerIdEq(condition.getCustomerId()),
                        customerNameLike(condition.getCustomerName()),
                        customerPhoneNumberLike(condition.getCustomerPhoneNumber()),
                        statusEq(condition.getStatus()),
                        deliveryStatusEq(condition.getDeliveryStatus()),
                        betweenDates(order.createdAt,condition.getStartDate(), condition.getEndDate())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(order.createdAt.desc())
                .fetch();

        Long total = queryFactory
                .select(order.count())
                .from(order)
                .where(
                        order.company.companyId.eq(companyId),
                        orderCodeLike(condition.getOrderCode()),
                        orderTypeEq(condition.getOrderType()),
                        customerIdEq(condition.getCustomerId()),
                        customerNameLike(condition.getCustomerName()),
                        customerPhoneNumberLike(condition.getCustomerPhoneNumber()),
                        statusEq(condition.getStatus()),
                        deliveryStatusEq(condition.getDeliveryStatus()),
                        betweenDates(order.createdAt,condition.getStartDate(), condition.getEndDate())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression orderCodeLike(String orderCode) {
        return orderCode != null ? order.code.like("%"+orderCode+"%") : null;
    }

    private BooleanExpression customerIdEq(Long customerId) {
        return customerId != null ? order.customer.id.eq(customerId) : null;
    }

    private BooleanExpression orderTypeEq(OrderType orderType) {
        return orderType != null ? order.type.eq(orderType) : null;
    }

    private BooleanExpression customerNameLike(String customerName) {
        return customerName != null ? order.customer.name.like("%" + customerName + "%") : null;
    }

    private BooleanExpression customerPhoneNumberLike(String phoneNumber) {
        return phoneNumber != null ? order.customer.phoneNumber.like("%" + phoneNumber + "%") : null;
    }

    private BooleanExpression statusEq(OrderStatus status) {
        return status != null ? order.status.eq(status) : null;
    }

    private BooleanExpression deliveryStatusEq(DeliveryStatus deliveryStatus) {
        return deliveryStatus != null ? order.deliveryStatus.eq(deliveryStatus) : null;
    }

    private BooleanExpression betweenDates(DateTimePath<LocalDateTime> datePath, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            LocalDateTime startOfDay = startDate.atStartOfDay();
            LocalDateTime endOfDay = endDate.plusDays(1).atStartOfDay().minusNanos(1);
            return datePath.between(startOfDay, endOfDay);
        }
        return null;
    }


}
