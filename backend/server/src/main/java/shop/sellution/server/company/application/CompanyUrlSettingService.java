package shop.sellution.server.company.application;


import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;

public interface CompanyUrlSettingService {
    FindCompanyUrlSettingRes getCompanyUrlSetting(Long companyId);
    void updateCompanyUrlSetting(SaveCompanyUrlSettingReq saveCompanyUrlSettingReq);

}
