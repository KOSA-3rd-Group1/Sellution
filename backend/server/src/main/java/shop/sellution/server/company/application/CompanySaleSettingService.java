package shop.sellution.server.company.application;


import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.dto.FindCompanySaleSettingRes;
import shop.sellution.server.company.dto.SaveCompanySaleSettingReq;

public interface CompanySaleSettingService {
    FindCompanySaleSettingRes getCompanySaleSetting(Long companyId);
    void updateCompanySaleSetting(SaveCompanySaleSettingReq saveCompanySaleSettingReq);
    void createCompanySaleSetting(SaveCompanySaleSettingReq saveCompanySaleSettingReq);
    void saveOptions(SaveCompanySaleSettingReq saveCompanySaleSettingReq, Company company);
    void updateOptions(SaveCompanySaleSettingReq saveCompanySaleSettingReq, Company company);
    void handleSellType(SaveCompanySaleSettingReq saveCompanySaleSettingReq, Company company);
}
