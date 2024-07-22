package shop.sellution.server.event.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import shop.sellution.server.company.domain.Company;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepositoryCustom {
    List<CouponEvent> findAllOngoingEvents(Company company, LocalDate now);
    Page<CouponEvent> findCouponsByCustomer(Long customerId, LocalDate now, Pageable pageable);
}
