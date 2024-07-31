package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class FindCompanyInfoRes {
    private Long companyId; // 회사 id
    private String displayName; // 로고 대신 보이는 회사명
    private String name; // companyName
    private String logoImageUrl;
    private List<String> promotionImageUrls;
    private DeliveryType serviceType; // 회사 서비스 유형 (단건, 정기, 둘다)
    private SubscriptionType subscriptionType;
    private int minDeliveryCount;
    private int maxDeliveryCount;
    private String themeColor;
    private String mainPromotion1Title;
    private String mainPromotion1Content;
    private String mainPromotion2Title;
    private String mainPromotion2Content;

    public static FindCompanyInfoRes fromEntity(Company company, List<CompanyImage> companyImages) {
        String logoImageUrl = companyImages.stream()
                .filter(image -> image.getPurposeOfUse() == ImagePurposeType.LOGO)
                .map(CompanyImage::getImageUrl)
                .findFirst()
                .orElse(null);

        List<String> promotionImageUrls = companyImages.stream()
                .filter(image -> image.getPurposeOfUse() == ImagePurposeType.PROMOTION)
                .map(CompanyImage::getImageUrl)
                .collect(Collectors.toList());

        return FindCompanyInfoRes.builder()
                .companyId(company.getCompanyId())
                .displayName(company.getName())
                .name(company.getName())
                .serviceType(company.getServiceType())
                .subscriptionType(company.getSubscriptionType())
                .minDeliveryCount(company.getMinDeliveryCount())
                .maxDeliveryCount(company.getMaxDeliveryCount())
                .themeColor(company.getThemeColor())
                .mainPromotion1Title(company.getMainPromotion1Title())
                .mainPromotion1Content(company.getMainPromotion1Content())
                .mainPromotion2Title(company.getMainPromotion2Title())
                .mainPromotion2Content(company.getMainPromotion2Content())
                .logoImageUrl(logoImageUrl)
                .promotionImageUrls(promotionImageUrls)
                .build();
    }
}
