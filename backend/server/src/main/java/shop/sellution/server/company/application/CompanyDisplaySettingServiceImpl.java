package shop.sellution.server.company.application;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.dto.FindCompanyDisplaySettingRes;
import shop.sellution.server.company.dto.SaveCompanyDisplaySettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.product.S3Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class CompanyDisplaySettingServiceImpl implements CompanyDisplaySettingService {
    private final CompanyRepository companyRepository;
    private final CompanyImageRepository companyImageRepository;
    private final S3Service s3Service;

    public CompanyDisplaySettingServiceImpl(CompanyRepository companyRepository, CompanyImageRepository companyImageRepository, S3Service s3Service) {
        this.companyRepository = companyRepository;
        this.companyImageRepository = companyImageRepository;
        this.s3Service = s3Service;
    }

    @Override
    public FindCompanyDisplaySettingRes getCompanyDisplaySetting(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        List<CompanyImage> companyImages = companyImageRepository.findAllByCompany(company);
        return FindCompanyDisplaySettingRes.fromEntity(company, companyImages);
    }

    @Override
    public void updateCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq ,MultipartFile logoFile,
                                            List<MultipartFile> promotionFiles) throws IOException {
        Company company = companyRepository.findById(saveCompanyDisplaySettingReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        companyRepository.save(saveCompanyDisplaySettingReq.toEntity(company));

        // Logo Image 처리
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = s3Service.uploadFile(logoFile, company.getCompanyId(), "setting");
            updateLogoImage(company, logoUrl);
        }

        // Promotion Images 처리
        if (promotionFiles != null && !promotionFiles.isEmpty()) {
            List<String> promotionUrls = new ArrayList<>();
            for (MultipartFile file : promotionFiles) {
                String url = s3Service.uploadFile(file, company.getCompanyId(), "setting");
                promotionUrls.add(url);
            }
            updatePromotionImages(company, promotionUrls);
        }


        // Logo Image 처리
//        CompanyImage logoImage = saveCompanyDisplaySettingReq.toLogoImageEntity(company);
//        List<CompanyImage> existingLogoImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO);
//
//        if (!existingLogoImages.isEmpty()) {
//            // Update existing logo image(s) only if the URL is different
//            for (CompanyImage existingImage : existingLogoImages) {
//                if (!existingImage.getImageUrl().equals(logoImage.getImageUrl())) {
//                    existingImage.setImageUrl(logoImage.getImageUrl());
//                    companyImageRepository.save(existingImage);
//                }
//            }
//        } else {
//            // Save new logo image if none exists
//            saveLogoImage(logoImage);
//        }
//
//        // Promotion Images 처리
//        List<CompanyImage> promotionImages = saveCompanyDisplaySettingReq.toPromotionImageEntities(company);
//        List<CompanyImage> existingPromotionImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION);
//        if (!existingPromotionImages.isEmpty()) {
//            // Delete and update promotion images only if the URLs are different
//            boolean needsUpdate = false;
//            for (CompanyImage existingImage : existingPromotionImages) {
//                if (!promotionImages.stream().anyMatch(img -> img.getImageUrl().equals(existingImage.getImageUrl()))) {
//                    needsUpdate = true;
//                    break;
//                }
//            }
//            if (needsUpdate) {
//                companyImageRepository.deleteAll(existingPromotionImages);
//                savePromotionImages(promotionImages);
//            }
//        } else {
//            savePromotionImages(promotionImages);
//        }


    }

    public void saveLogoImage(CompanyImage logoImage) {
        if (logoImage.getImageUrl() != null) {
            companyImageRepository.save(logoImage);
        }
    }

    public void updateLogoImage(Company company, String imageUrl) {
        Optional<CompanyImage> existingImageOpt = companyImageRepository.findByCompanyAndPurposeOfUse(company, ImagePurposeType.LOGO);
        if (existingImageOpt.isPresent()) {
            CompanyImage existingImage = existingImageOpt.get();
            existingImage.setImageUrl(imageUrl);
            companyImageRepository.save(existingImage);
        } else {
            CompanyImage newLogoImage = CompanyImage.builder()
                    .company(company)
                    .imageUrl(imageUrl)
                    .purposeOfUse(ImagePurposeType.LOGO)
                    .build();
            companyImageRepository.save(newLogoImage);
        }
    }

    public void savePromotionImages(List<CompanyImage> promotionImages) {
        if (promotionImages != null) {
            companyImageRepository.saveAll(promotionImages);
        }
    }

    public void updatePromotionImages(Company company, List<String> imageUrls) {
        List<CompanyImage> existingPromotionImages = companyImageRepository.findAllByCompanyAndPurposeOfUse(company, ImagePurposeType.PROMOTION);
        companyImageRepository.deleteAll(existingPromotionImages);

        List<CompanyImage> newPromotionImages = imageUrls.stream()
                .map(url -> CompanyImage.builder()
                        .company(company)
                        .imageUrl(url)
                        .purposeOfUse(ImagePurposeType.PROMOTION)
                        .build())
                .collect(Collectors.toList());

        companyImageRepository.saveAll(newPromotionImages);
    }

}
