package shop.sellution.server.company.application;


import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;

import java.io.IOException;
import java.util.List;

public interface CompanyDisplaySettingService {
    FindCompanyDisplaySettingRes getCompanyDisplaySetting(Long companyId);
    void updateCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq, MultipartFile logoFile, List<MultipartFile> promotionFiles) throws IOException;
    void saveLogoImage(CompanyImage logoImage);
    void updateLogoImage(Company company, String imageUrl);
    void savePromotionImages(List<CompanyImage> promotionImages);
    void updatePromotionImages(Company company, List<String> imageUrls);
}
