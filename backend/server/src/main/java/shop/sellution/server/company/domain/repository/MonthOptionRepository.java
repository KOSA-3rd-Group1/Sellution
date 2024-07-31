package shop.sellution.server.company.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.MonthOption;

import java.util.List;
import java.util.Optional;


public interface MonthOptionRepository extends JpaRepository<MonthOption, Long> {
    List<MonthOption> findByCompany(Company company);

    @Transactional
    @Modifying
    @Query("DELETE FROM MonthOption m WHERE m.company = :company")
    void deleteByCompany(Company company);

    List<MonthOption> findAllByCompany(Company company);


    @Query(
            """
                    select m from MonthOption m
                    where m.company = :company
                    and m.monthValue = :monthValue
                    """
    )
    Optional<MonthOption> findByCompanyAndDayValue(Company company, Integer monthValue);
}
