package shop.sellution.server.company.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import shop.sellution.server.company.domain.MonthOption;

public interface MonthOptionRepository extends JpaRepository<MonthOption, Long> {
}
