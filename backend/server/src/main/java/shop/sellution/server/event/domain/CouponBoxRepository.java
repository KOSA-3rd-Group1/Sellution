package shop.sellution.server.event.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponBoxRepository extends JpaRepository<CouponBox, CouponBoxId> {
    boolean existsByCustomerIdAndCouponEventId(Long customerId, Long eventId);

    long countByCouponEvent_Id(Long couponEventId);

}
