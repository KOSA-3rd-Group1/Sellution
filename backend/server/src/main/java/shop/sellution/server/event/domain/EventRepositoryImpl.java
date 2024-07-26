package shop.sellution.server.event.domain;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDate;
import java.util.List;

import static shop.sellution.server.event.domain.QCouponBox.couponBox;
import static shop.sellution.server.event.domain.QCouponEvent.couponEvent;

@RequiredArgsConstructor
@Repository
public class EventRepositoryImpl implements EventRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<CouponEvent> findAllOngoingEvents(Company company, LocalDate now) {
        QCouponEvent couponEvent = QCouponEvent.couponEvent;

        return queryFactory.selectFrom(couponEvent)
                .where(
                        couponEvent.company.eq(company)
                                .and(couponEvent.isDeleted.isFalse())
                                .and(couponEvent.eventStartDate.loe(now))
                                .and(couponEvent.eventEndDate.goe(now))
                )
                .fetch();
    }

    public Page<CouponEvent> findCouponsByCustomer(Long customerId, LocalDate now, Pageable pageable) {
        List<CouponEvent> res = queryFactory
                .select(couponEvent)
                .from(couponEvent)
                .join(couponBox).on(couponBox.couponEvent.eq(couponEvent))
                .where(
                        couponBox.customer.id.eq(customerId),
                        couponBox.isUsed.eq(DisplayStatus.N),   //isDeleted는 판단조건 X
                        couponEvent.eventEndDate.goe(now)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(couponEvent.count())
                .from(couponEvent)
                .join(couponBox).on(couponBox.couponEvent.eq(couponEvent))
                .where(
                        couponBox.customer.id.eq(customerId),
                        couponBox.isUsed.eq(DisplayStatus.N),   //isDeleted는 판단조건 X
                        couponEvent.eventEndDate.goe(now)
                )
                .fetchOne();

        return new PageImpl<>(res, pageable, total != null ? total : 0L );
    }

    @Override
    public Page<CouponEvent> findEventsByCompanyAndDate(Company company, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        QCouponEvent couponEvent = QCouponEvent.couponEvent;

        List<CouponEvent> res = queryFactory
                .select(couponEvent)
                .from(couponEvent)
                .where(
                        couponEvent.company.eq(company)
                                .and(couponEvent.isDeleted.isFalse())
                                .and(couponEvent.eventStartDate.loe(endDate))
                                .and(couponEvent.eventEndDate.goe(startDate))
                )
                .fetch();

        Long total = queryFactory
                .select(couponEvent.count())
                .from(couponEvent)
                .where(
                        couponEvent.company.eq(company)
                                .and(couponEvent.isDeleted.isFalse())
                                .and(couponEvent.eventStartDate.loe(startDate))
                                .and(couponEvent.eventEndDate.goe(endDate))
                )
                .fetchOne();
        return new PageImpl<>(res, pageable, total != null ? total : 0L );

    }

}
