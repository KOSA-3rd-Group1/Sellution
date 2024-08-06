package shop.sellution.server.event.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import shop.sellution.server.customer.domain.Customer;

import java.util.Optional;

@Repository
public interface CouponBoxRepository extends JpaRepository<CouponBox, CouponBoxId> {
    boolean existsByCustomerIdAndCouponEventId(Long customerId, Long eventId);

    long countByCouponEvent_Id(Long couponEventId);

    // 쿠폰 이벤트와 사용자아이디를 통해 쿠폰박스를 조회한다.
    @Query("""
            select cb from CouponBox cb
            where cb.couponEvent.id = :couponEventId
            and cb.customer.id = :customerId
            """)
    Optional<CouponBox> findByCouponEventAndCustomerId(Long couponEventId, Long customerId);

}
