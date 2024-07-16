package shop.sellution.server.company.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import shop.sellution.server.company.domain.Company;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);

    //company Id로 조회
    Optional<Company> findById(Long id);

    //name 존재 여부 확인 - name 중복 검사용
    boolean existsByName(String name);
}
