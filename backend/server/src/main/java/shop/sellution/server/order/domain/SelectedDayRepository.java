package shop.sellution.server.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SelectedDayRepository extends JpaRepository<SelectedDay, Long> {

    @Query("""
            select s from SelectedDay s
            join fetch s.order
            join fetch s.dayOption
            where s.order.id in :orderIds
            """)
    List<SelectedDay> findByOrderId(List<Long> orderIds);
}
