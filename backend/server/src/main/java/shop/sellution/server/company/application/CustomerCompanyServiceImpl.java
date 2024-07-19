package shop.sellution.server.company.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_NAME;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerCompanyServiceImpl implements CustomerCompanyService {
    private final CompanyRepository companyRepository;

    @Override
    @Transactional(readOnly = true)
    public Long findCompanyIdByName(String name) {
        Company company = companyRepository.
                findByName(name).
                orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_NAME));
        return company.getCompanyId();
    }
}
