package shop.sellution.server.payment.domain.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.payment.dto.request.FindPaymentHistoryCond;
import shop.sellution.server.payment.dto.response.FindPaymentHistoryRes;

import static shop.sellution.server.payment.domain.QPaymentHistory.paymentHistory;
import static shop.sellution.server.order.domain.QOrder.order;
import static shop.sellution.server.customer.domain.QCustomer.customer;

@Repository
@RequiredArgsConstructor
public class PaymentHistoryRepositoryCustomImpl implements PaymentHistoryRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<FindPaymentHistoryRes> findPaymentHistoryByConditions(
            Long customerId,
            FindPaymentHistoryCond findPaymentHistoryCond,
            Pageable pageable
    ) {
        JPAQuery<FindPaymentHistoryRes> query = queryFactory
                .select(
                        Projections.constructor(FindPaymentHistoryRes.class,
                                paymentHistory.id,
                                order.customer.id,
                                paymentHistory.price,
                                paymentHistory.remainingPaymentCount,
                                paymentHistory.totalPaymentCount,
                                paymentHistory.createdAt,
                                paymentHistory.status)
                )
                .from(paymentHistory)
                .join(paymentHistory.order, order)
                .join(order.customer, customer)
                .where(
                        dateRangePredicate(paymentHistory.createdAt, startDate, endDate),
                        orderIdEq(order.id, orderId),
                        customerIdEq(customer.id, customerId)
                );
    }
}
