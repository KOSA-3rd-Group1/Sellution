package shop.sellution.server.contractcompany.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.contractcompany.dto.request.FindContractCompanyReq;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.contractcompany.dto.response.FindContractCompanyRes;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.type.DeliveryType;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ContractCompanyServiceImpl implements ContractCompanyService {

    private final ContractCompanyRepository contractCompanyRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public Long saveContractCompany(SaveContractCompanyReq request) {

        validateUniqueBusinessRegistrationNumber(request.getBusinessRegistrationNumber());
        validateUniqueContractAuthId(request.getContractAuthId());

        Company company = createAndSaveCompany(request.getContractCompanyName());

        ContractCompany contractCompany = createContractCompany(request, company);
        ContractCompany savedContractCompany = contractCompanyRepository.save(contractCompany);

        return savedContractCompany.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public FindContractCompanyRes findContractCompany(FindContractCompanyReq request) {
        ContractCompany contractCompany = contractCompanyRepository.findByContractAuthId(request.getContractAuthId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUNT_CONTRACT_AUTH_ID));

        validatePassword(request.getContractAuthPassword(), contractCompany.getContractAuthPassword());

        return new FindContractCompanyRes(
                contractCompany.getCompany().getCompanyId(),
                contractCompany.getContractCompanyName(),
                contractCompany.getBusinessRegistrationNumber()
        );
    }

    // 사업자 등록 번호 중복 여부 확인
    private void validateUniqueBusinessRegistrationNumber(String businessRegistrationNumber) {
        if (contractCompanyRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_CONTRACT_COMPANY_BUSINESS_REGISTRATION_NUMBER);
        }
    }

    // 계약 사업체 인증 아이디 중복 여부 확인
    private void validateUniqueContractAuthId(String contractAuthId) {
        if (contractCompanyRepository.existsByContractAuthId(contractAuthId)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_CONTRACT_COMPANY_CONTRACT_AUTH_ID);
        }
    }

    // 사업체(설정) 객체 생성 및 저장
    private Company createAndSaveCompany(String contractCompanyName) {
        String uniqueName = generateUniqueName(contractCompanyName);
        Company company = Company.builder()
                .displayName(contractCompanyName)
                .name(uniqueName)
                .serviceType(DeliveryType.BOTH)
                .subscriptionType(SubscriptionType.MONTH)
                .sellType(SellType.ALL)
                .shopUrl(generateShopUrl(uniqueName))
                .build();
        return companyRepository.save(company);
    }
    private String generateShopUrl(String name) {
        return "https://www.sellution.shop/shopping/" + name;
    }

    // 계약 사업체 객체 생성
    private ContractCompany createContractCompany(SaveContractCompanyReq request, Company company) {
        int EXPIRATION_PERIOD_DAYS = 7; //만료 기간 (7일 후 만료)
        return ContractCompany.builder()
                .company(company)
                .contractCompanyName(request.getContractCompanyName())
                .businessRegistrationNumber(request.getBusinessRegistrationNumber())
                .contractAuthId(request.getContractAuthId())
                .contractAuthPassword(passwordEncoder.encode(request.getContractAuthPassword()))
                .expiresAt(LocalDateTime.now().plusDays(EXPIRATION_PERIOD_DAYS))
                .build();
    }

    private String generateUniqueName(String name) {
        int RANDOM_NAME_SUFFIX_MIN = 1000;
        int RANDOM_NAME_SUFFIX_MAX = 9999;

        Random random = new Random();
        int randomNum = RANDOM_NAME_SUFFIX_MIN + random.nextInt(RANDOM_NAME_SUFFIX_MAX - RANDOM_NAME_SUFFIX_MIN + 1);
        return name + "-" + randomNum;
    }

    // 비밀 번호 검증 로직
    private void validatePassword(String reqPassword, String contractCompanyPassword) {
        if (!passwordEncoder.matches(reqPassword, contractCompanyPassword)) {
            throw new BadRequestException(ExceptionCode.INVALID_PASSWORD);
        }
    }
}
