package shop.sellution.server.company.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import shop.sellution.server.company.domain.DayOption;
import java.util.List;

public interface DayOptionRepository extends JpaRepository<DayOption, Long> {

    List<DayOption> findByIdIn(List<Long> dayOptionIds);
}
