package shop.sellution.server.customer.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import shop.sellution.server.customer.domain.repository.CustomerRepositoryCustom;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long>, QuerydslPredicateExecutor<Customer>,
        CustomerRepositoryCustom {

    // 사업체 별 회원의 아이디로 회원 조회
    Optional<Customer> findByCompany_CompanyIdAndUsername(Long companyId, String username);

    // 사업체 별 회원의 전화번호로 회원 조회
    Optional<Customer> findByCompany_CompanyIdAndPhoneNumber(Long companyId, String phoneNumber);

    // 사업체 별 회원의 아이디 중복 여부 확인
    boolean existsByCompany_CompanyIdAndUsername(Long companyId, String username);

    // 사업체 별 회원의 전화번호 중복 여부 확인
    boolean existsByCompany_CompanyIdAndPhoneNumber(Long companyId, String phoneNumber);

    // 최신 배송일자가 오늘보다 60일 이상 차이나는 회원은 휴면회원으로 변경
    @Modifying // 벌크성 수정연산
    @Query("""
            update Customer c set c.type = 'DORMANT'
            where c.latestDeliveryDate < :date
            """)
    int updateDormantCustomerType(@Param("date") LocalDateTime date);

}
