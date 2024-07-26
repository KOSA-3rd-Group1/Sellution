package shop.sellution.server.company.application;

import shop.sellution.server.company.dto.FindCompanyInfoRes;

public interface CompanyService {
    FindCompanyInfoRes findCompanyId(String companyName);
}
