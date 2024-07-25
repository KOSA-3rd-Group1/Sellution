package shop.sellution.server.company.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyInfoRes;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.List;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyImageRepository companyImageRepository;


    @Override
    public FindCompanyInfoRes findCompanyId(String companyName) {
        Company company = companyRepository.findByName(companyName)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY));
        List<CompanyImage> companyImages = companyImageRepository.findAllByCompany(company);
        return FindCompanyInfoRes.fromEntity(company, companyImages);
    }
}
