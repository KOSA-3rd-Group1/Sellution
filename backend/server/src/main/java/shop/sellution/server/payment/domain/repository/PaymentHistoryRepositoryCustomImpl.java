package shop.sellution.server.payment.domain.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

import java.time.LocalDateTime;
import java.util.List;

import static shop.sellution.server.payment.domain.QPaymentHistory.paymentHistory;
import static shop.sellution.server.order.domain.QOrder.order;
import static shop.sellution.server.customer.domain.QCustomer.customer;

@Repository
@RequiredArgsConstructor
public class PaymentHistoryRepositoryCustomImpl implements PaymentHistoryRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<FindPaymentHistoryRes> findPaymentHistoryByConditions(
            Long companyId,
            FindPaymentHistoryCond findPaymentHistoryCond,
            Pageable pageable
    ) {
        JPAQuery<FindPaymentHistoryRes> query = queryFactory
                .select(Projections.constructor(FindPaymentHistoryRes.class,
                        paymentHistory.id.as("paymentHistoryId"),
                        order.customer.id.as("companyId"),
                        paymentHistory.price,
                        paymentHistory.remainingPaymentCount.as("remainingPayCount"),
                        paymentHistory.totalPaymentCount.as("totalCountForPayment"),
                        paymentHistory.createdAt.as("paymentDate"),
                        paymentHistory.status))
                .from(paymentHistory)
                .join(paymentHistory.order, order)
                .join(order.customer, customer)
                .where(
                        companyIdEq(companyId),
                        orderIdEq(findPaymentHistoryCond.getOrderId()),
                        betweenDates(paymentHistory.createdAt, findPaymentHistoryCond.getStartDate(), findPaymentHistoryCond.getEndDate())
                );

        Long total = queryFactory
                .select(paymentHistory.count())
                .from(paymentHistory)
                .join(paymentHistory.order, order)
                .join(order.customer, customer)
                .where(
                        companyIdEq(companyId),
                        orderIdEq(findPaymentHistoryCond.getOrderId()),
                        betweenDates(paymentHistory.createdAt, findPaymentHistoryCond.getStartDate(), findPaymentHistoryCond.getEndDate())
                ).fetchOne();

        List<FindPaymentHistoryRes> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression companyIdEq(Long companyId) {
        return companyId != null ? order.company.companyId.eq(companyId) : null;
    }

    private BooleanExpression orderIdEq(Long orderId) {
        return orderId != null ? order.id.eq(orderId) : null;
    }

    private BooleanExpression betweenDates(DateTimePath<LocalDateTime> datePath, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            return datePath.between(startDate, endDate);
        }
        return null;
    }
}
