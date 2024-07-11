package shop.sellution.server.customer.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.dto.request.SaveCustomerReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService{

    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Long saveCustomer(SaveCustomerReq request) {

        validateUniqueUsername(request.getCompanyId(), request.getUsername());
        validatePhoneNumber(request.getCompanyId(), request.getPhoneNumber());

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY_ID));

        Customer customer = createCustomer(company, request);
        Customer savedCustomer = customerRepository.save(customer);

        return savedCustomer.getId();
    }

    // company 별 username 중복 확인 (다른 company에서는 username 중복 가능)
    private void validateUniqueUsername(Long companyId, String username) {
        if (customerRepository.existsByCompany_CompanyIdAndUsername(companyId, username)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_USERNAME);
        }
    }

    // company 별 phoneNumber 중복 확인 (다른 company에서는 phoneNumber는 중복 가능)
    private void validatePhoneNumber(Long companyId, String phoneNumber) {
        if (customerRepository.existsByCompany_CompanyIdAndPhoneNumber(companyId, phoneNumber)) {
            throw new BadRequestException(ExceptionCode.DUPLICATED_PHONE_NUMBER);
        }
    }

    // customer 생성
    private Customer createCustomer(Company company, SaveCustomerReq request) {
        return Customer.builder()
                .company(company)
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }
}
