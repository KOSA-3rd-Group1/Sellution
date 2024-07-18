package shop.sellution.server.company.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import shop.sellution.server.company.domain.Company;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);

    //company Id로 조회
    Optional<Company> findById(Long id);

    //name 존재 여부 확인 - name 중복 검사용
    boolean existsByName(String name);

    @Query("select c.isAutoApproved from Company c where c.companyId = :companyId")
    String findIsAutoApprovedByCompanyId(Long companyId);
}
