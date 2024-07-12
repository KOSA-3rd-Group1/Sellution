package shop.sellution.server.company.application;

import org.springframework.stereotype.Service;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;

@Service
public class CompanyUrlSettingServiceImpl implements CompanyUrlSettingService {
    private final CompanyRepository companyRepository;
    private final CompanyImageRepository companyImageRepository;


    public CompanyUrlSettingServiceImpl(CompanyRepository companyRepository, CompanyImageRepository companyImageRepository) {
        this.companyRepository = companyRepository;
        this.companyImageRepository = companyImageRepository;
    }

    @Override
    public FindCompanyUrlSettingRes getCompanyUrlSetting(Long companyId){
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new RuntimeException("Company not found"));
        return FindCompanyUrlSettingRes.fromEntity(company);
    }

    @Override
    public void updateCompanyUrlSetting(SaveCompanyUrlSettingReq saveCompanyUrlSettingReq){
        Company company = companyRepository.findById(saveCompanyUrlSettingReq.getCompanyId()).orElseThrow(() -> new RuntimeException("Company not found"));
        companyRepository.save(saveCompanyUrlSettingReq.toEntity(company));
    }

}




