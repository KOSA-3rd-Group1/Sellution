package shop.sellution.server.customer.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // 사업체 별 회원의 아이디로 회원 조회
    Optional<Customer> findByCompany_CompanyIdAndUsername(Long companyId, String username);

    // 사업체 별 회원의 전화번호로 회원 조회
    Optional<Customer> findByCompany_CompanyIdAndPhoneNumber(Long companyId, String phoneNumber);


    // 사업체 별 회원의 아이디 중복 여부 확인
    boolean existsByCompany_CompanyIdAndUsername(Long companyId, String username);

    // 사업체 별 회원의 전화번호 중복 여부 확인
    boolean existsByCompany_CompanyIdAndPhoneNumber(Long companyId, String phoneNumber);
}
