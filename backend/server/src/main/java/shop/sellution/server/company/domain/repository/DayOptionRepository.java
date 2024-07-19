package shop.sellution.server.company.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.DayOption;

import java.util.List;

public interface DayOptionRepository extends JpaRepository<DayOption, Long> {
    List<DayOption> findByCompany(Company company);

    @Transactional
    @Modifying
    @Query("DELETE FROM DayOption d WHERE d.company = :company")
    void deleteByCompany(Company company);

    List<DayOption> findByIdIn(List<Long> dayOptionIds);
}
