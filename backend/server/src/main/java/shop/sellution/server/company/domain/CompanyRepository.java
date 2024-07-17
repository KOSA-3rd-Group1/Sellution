package shop.sellution.server.company.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    //company Id로 조회
    Optional<Company> findById(Long id);

    //name 존재 여부 확인 - name 중복 검사용
    boolean existsByName(String name);

    //shopUrl로 companyId 조회
    Optional<Company> findCompanyIdByShopUrl(String shopUrl);

}
