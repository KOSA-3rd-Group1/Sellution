package shop.sellution.server.company.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.repository.CompanyRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerCompanyServiceImpl implements CustomerCompanyService {
    private final CompanyRepository companyRepository;
    @Override
    @Transactional(readOnly = true)
    public Long findCompanyIdByName(String name) {
        return companyRepository.findByName(name).orElseThrow().getCompanyId(); //예외처리 하기
    }
}
