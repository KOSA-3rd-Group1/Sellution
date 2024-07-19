package shop.sellution.server.company.application;


import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;

import java.util.List;

public interface CompanyDisplaySettingService {
    FindCompanyDisplaySettingRes getCompanyDisplaySetting(Long companyId);
    void updateCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq);
    void saveLogoImage(CompanyImage logoImage);
    void updateLogoImage(Company company, CompanyImage logoImage);
    void savePromotionImages(List<CompanyImage> promotionImages);
    void updatePromotionImages(Company company, List<CompanyImage> promotionImages);
}
