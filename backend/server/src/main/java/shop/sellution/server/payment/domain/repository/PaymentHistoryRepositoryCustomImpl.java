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
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

import java.time.LocalDate;
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
                        order.code.as("orderCode"),
                        customer.name.as("userName"),
                        paymentHistory.price,
                        paymentHistory.remainingPaymentCount.as("remainingPayCount"),
                        paymentHistory.totalPaymentCount.as("totalCountForPayment"),
                        paymentHistory.createdAt.as("paymentDate"),
                        paymentHistory.status))
                .from(paymentHistory)
                .join(paymentHistory.order, order)
                .join(order.customer, customer)
                .where(
                        paymentHistory.order.company.companyId.eq(companyId),
                        orderCodeLike(findPaymentHistoryCond.getOrderCode()),
                        userNameLike(findPaymentHistoryCond.getUserName()),
                        statusEq(findPaymentHistoryCond.getStatus()),
                        betweenDates(paymentHistory.createdAt, findPaymentHistoryCond.getStartDate(), findPaymentHistoryCond.getEndDate())
                );

        Long total = queryFactory
                .select(paymentHistory.count())
                .from(paymentHistory)
                .join(paymentHistory.order, order)
                .join(order.customer, customer)
                .where(
                        paymentHistory.order.company.companyId.eq(companyId),
                        orderCodeLike(findPaymentHistoryCond.getOrderCode()),
                        userNameLike(findPaymentHistoryCond.getUserName()),
                        statusEq(findPaymentHistoryCond.getStatus()),
                        betweenDates(paymentHistory.createdAt, findPaymentHistoryCond.getStartDate(), findPaymentHistoryCond.getEndDate())
                ).fetchOne();

        List<FindPaymentHistoryRes> content = query
                .orderBy(paymentHistory.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


        return new PageImpl<>(content, pageable, total != null ? total : 0L);
    }

    private BooleanExpression companyIdEq(Long companyId) {
        return companyId != null ? order.company.companyId.eq(companyId) : null;
    }

    private BooleanExpression orderCodeLike(String orderCode) {
        return orderCode != null ? order.code.like("%" + orderCode + "%") : null;
    }

    private BooleanExpression userNameLike(String userName) {
        return userName != null ? customer.name.like("%" + userName + "%") : null;
    }

    private BooleanExpression statusEq(PaymentStatus status) {
        return status != null ? paymentHistory.status.eq(status) : null;
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
