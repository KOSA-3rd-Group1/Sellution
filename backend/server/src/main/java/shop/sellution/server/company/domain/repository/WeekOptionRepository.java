package shop.sellution.server.company.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.WeekOption;

import java.util.List;
import java.util.Optional;

public interface WeekOptionRepository extends JpaRepository<WeekOption, Long> {
    List<WeekOption> findByCompany(Company company);

    @Transactional
    @Modifying
    @Query("DELETE FROM WeekOption w WHERE w.company = :company")
    void deleteByCompany(Company company);

    List<WeekOption> findAllByCompany(Company company);

    @Query(
            """
                    select w from WeekOption w
                    where w.company = :company
                    and w.weekValue = :weekValue
                    """
    )
    Optional<WeekOption> findByCompanyAndDayValue(Company company, Integer weekValue);
}
