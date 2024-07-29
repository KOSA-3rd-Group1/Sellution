package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class FindCompanyDisplaySettingRes {
    private Long companyId;
    private String displayName;
    private String logoImageUrl; //null이면 displayName 넣어줌
    private List<String> promotionImageUrls;
    private DeliveryType serviceType;
    private String themeColor; //deflaut값 있음
    private String mainPromotion1Title; //deflaut값 있음
    private String mainPromotion1Content; //deflaut값 있음
    private String mainPromotion2Title; //deflaut값 있음
    private String mainPromotion2Content;


    public static FindCompanyDisplaySettingRes fromEntity(Company company, List<CompanyImage> companyImages) {
        String logoImageUrl = companyImages.stream()
                .filter(image -> image.getPurposeOfUse() == ImagePurposeType.LOGO)
                .map(CompanyImage::getImageUrl)
                .findFirst()
                .orElse(null);

        List<String> promotionImageUrls = companyImages.stream()
                .filter(image -> image.getPurposeOfUse() == ImagePurposeType.PROMOTION)
                .map(CompanyImage::getImageUrl)
                .collect(Collectors.toList());

        return FindCompanyDisplaySettingRes.builder()
                .companyId(company.getCompanyId())
                .displayName(company.getName())
                .themeColor(company.getThemeColor())
                .serviceType(company.getServiceType())
                .mainPromotion1Title(company.getMainPromotion1Title())
                .mainPromotion1Content(company.getMainPromotion1Content())
                .mainPromotion2Title(company.getMainPromotion2Title())
                .mainPromotion2Content(company.getMainPromotion2Content())
                .logoImageUrl(logoImageUrl)
                .promotionImageUrls(promotionImageUrls)
                .build();
    }
}
