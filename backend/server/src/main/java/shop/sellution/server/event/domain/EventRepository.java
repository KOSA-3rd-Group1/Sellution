package shop.sellution.server.event.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<CouponEvent, Long> {

    Page<CouponEvent> findAllByCompanyCompanyIdAndIsDeletedFalse(Long companyId, Pageable pageable);

    Optional<CouponEvent> findByIdAndIsDeletedFalse(Long eventId);

    @Query("""
            select cp from CouponEvent cp
            where cp.id = :eventId
            """)
    Optional<CouponEvent> findByEventId(Long eventId);
}
