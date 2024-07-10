package shop.sellution.server.contractcompany.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractCompanyRepository extends JpaRepository<ContractCompany, Long> {

    //계약 사업체 아이디 조회
    Optional<ContractCompany> findById(Long id);

    //인증 아이디 조회
    Optional<ContractCompany> findByContractAuthId(String contractAuthId);

    //인증 아이디 중복 조회
    boolean existsByContractAuthId(String contractAuthId);

    //사업자 등록번호 중복 조회
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
}
