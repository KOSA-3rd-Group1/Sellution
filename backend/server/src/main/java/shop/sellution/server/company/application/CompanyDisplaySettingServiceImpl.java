package shop.sellution.server.company.application;


import org.springframework.stereotype.Service;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;

import java.util.List;
import java.util.Optional;


@Service
public class CompanyDisplaySettingServiceImpl implements CompanyDisplaySettingService {
    private final CompanyRepository companyRepository;
    private final CompanyImageRepository companyImageRepository;

    public CompanyDisplaySettingServiceImpl(CompanyRepository companyRepository, CompanyImageRepository companyImageRepository) {
        this.companyRepository = companyRepository;
        this.companyImageRepository = companyImageRepository;
    }

    @Override
    public FindCompanyDisplaySettingRes getCompanyDisplaySetting(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new RuntimeException("Company not found"));
        List<CompanyImage> companyImages = companyImageRepository.findAllByCompany(company);
        return FindCompanyDisplaySettingRes.fromEntity(company, companyImages);
    }

    @Override
    public void updateCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq) {
        Company company = companyRepository.findById(saveCompanyDisplaySettingReq.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        companyRepository.save(saveCompanyDisplaySettingReq.toEntity(company));

        // Logo Image 처리
        CompanyImage logoImage = saveCompanyDisplaySettingReq.toLogoImageEntity(company);
        List<CompanyImage> existingLogoImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO);
        if (!existingLogoImages.isEmpty()) {
            // Update existing logo image(s) only if the URL is different
            for (CompanyImage existingImage : existingLogoImages) {
                if (!existingImage.getImageUrl().equals(logoImage.getImageUrl())) {
                    existingImage.setImageUrl(logoImage.getImageUrl());
                    companyImageRepository.save(existingImage);
                }
            }
        } else {
            // Save new logo image if none exists
            saveLogoImage(logoImage);
        }

        // Promotion Images 처리
        List<CompanyImage> promotionImages = saveCompanyDisplaySettingReq.toPromotionImageEntities(company);
        List<CompanyImage> existingPromotionImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION);
        if (!existingPromotionImages.isEmpty()) {
            // Delete and update promotion images only if the URLs are different
            boolean needsUpdate = false;
            for (CompanyImage existingImage : existingPromotionImages) {
                if (!promotionImages.stream().anyMatch(img -> img.getImageUrl().equals(existingImage.getImageUrl()))) {
                    needsUpdate = true;
                    break;
                }
            }
            if (needsUpdate) {
                companyImageRepository.deleteAll(existingPromotionImages);
                savePromotionImages(promotionImages);
            }
        } else {
            savePromotionImages(promotionImages);
        }


    }

    public void saveLogoImage(CompanyImage logoImage) {
        if (logoImage.getImageUrl() != null) {
            companyImageRepository.save(logoImage);
        }
    }

    public void updateLogoImage(Company company, CompanyImage logoImage) {
        if (logoImage.getImageUrl() != null) {
            Optional<CompanyImage> existingImageOpt = companyImageRepository.findByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO);
            if (existingImageOpt.isPresent()) {
                CompanyImage existingImage = existingImageOpt.get();
                existingImage.setImageUrl(logoImage.getImageUrl());
                companyImageRepository.save(existingImage);
            }
        }
    }

    public void savePromotionImages(List<CompanyImage> promotionImages) {
        if (promotionImages != null) {
            companyImageRepository.saveAll(promotionImages);
        }
    }

    public void updatePromotionImages(Company company, List<CompanyImage> promotionImages) {
        if (promotionImages != null) {
            List<CompanyImage> existingPromotionImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION);
            companyImageRepository.deleteAll(existingPromotionImages);
            companyImageRepository.saveAll(promotionImages);
        }
    }

}
