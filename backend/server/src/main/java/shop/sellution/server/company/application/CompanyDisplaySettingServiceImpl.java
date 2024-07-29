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
import shop.sellution.server.company.dto.SaveCompanySaleSettingReq;
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

    public void createCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq, MultipartFile logoFile,
                                            List<MultipartFile> promotionFiles) throws IOException {
        Company company = companyRepository.findById(saveCompanyDisplaySettingReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        companyRepository.save(saveCompanyDisplaySettingReq.toEntity(company));

        // Logo Image 처리
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = s3Service.uploadFile(logoFile, company.getCompanyId(), "setting", ImagePurposeType.LOGO);
            saveCompanyDisplaySettingReq.setLogoImageUrl(logoUrl);
            saveLogoImage(CompanyImage.builder()
                    .company(company)
                    .imageUrl(logoUrl)
                    .purposeOfUse(ImagePurposeType.LOGO)
                    .build());
        } else if (saveCompanyDisplaySettingReq.getLogoImageUrl() != null) {
            saveLogoImage(CompanyImage.builder()
                    .company(company)
                    .imageUrl(saveCompanyDisplaySettingReq.getLogoImageUrl())
                    .purposeOfUse(ImagePurposeType.LOGO)
                    .build());
        }

        List<String> promotionUrls = new ArrayList<>();
        if (promotionFiles != null && !promotionFiles.isEmpty()) {
            for (MultipartFile file : promotionFiles) {
                String url = s3Service.uploadFile(file, company.getCompanyId(), "setting", ImagePurposeType.PROMOTION);
                promotionUrls.add(url);
            }
        }
        if (saveCompanyDisplaySettingReq.getPromotionImageUrls() != null) {
            promotionUrls.addAll(saveCompanyDisplaySettingReq.getPromotionImageUrls());
        }
        savePromotionImages(promotionUrls.stream()
                .map(url -> CompanyImage.builder()
                        .company(company)
                        .imageUrl(url)
                        .purposeOfUse(ImagePurposeType.PROMOTION)
                        .build())
                .collect(Collectors.toList()));

    }

    public void updateCompanyDisplaySetting(SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq, MultipartFile logoFile,
                                            List<MultipartFile> promotionFiles) throws IOException {
        Company company = companyRepository.findById(saveCompanyDisplaySettingReq.getCompanyId())
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        companyRepository.save(saveCompanyDisplaySettingReq.toEntity(company));

        // Logo Image 처리
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = s3Service.uploadFile(logoFile, company.getCompanyId(), "setting", ImagePurposeType.LOGO);
            saveCompanyDisplaySettingReq.setLogoImageUrl(logoUrl);
            updateLogoImage(company, logoUrl);
        } else if (saveCompanyDisplaySettingReq.getLogoImageUrl() != null) {
            updateLogoImage(company, saveCompanyDisplaySettingReq.getLogoImageUrl());
        }

        // Promotion Images 처리
        List<String> promotionUrls = new ArrayList<>();
        if (promotionFiles != null && !promotionFiles.isEmpty()) {
            for (MultipartFile file : promotionFiles) {
                String url = s3Service.uploadFile(file, company.getCompanyId(), "setting", ImagePurposeType.PROMOTION);
                promotionUrls.add(url);
            }
        }
        if (saveCompanyDisplaySettingReq.getPromotionImageUrls() != null) {
            promotionUrls.addAll(saveCompanyDisplaySettingReq.getPromotionImageUrls());
        }
        updatePromotionImages(company, promotionUrls);
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
