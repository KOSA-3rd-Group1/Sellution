package shop.sellution.server.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyImage;
import shop.sellution.server.company.domain.type.ImagePurposeType;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaveCompanyDisplaySettingReq {
    private Long companyId;

    @NotBlank(message = "회사명은 필수 입니다.")
    private String displayName;

    private String logoImageUrl; //null이면 displayName 넣어줌
    private List<String> promotionImageUrls;

    private String themeColor; //deflaut값 있음
    private String mainPromotion1Title; //deflaut값 있음
    private String mainPromotion1Content; //deflaut값 있음
    private String mainPromotion2Title; //deflaut값 있음
    private String mainPromotion2Content; //deflaut값 있음

    public Company toEntity(Company company) {
        company.setDisplayName(this.displayName);
        company.setThemeColor(this.themeColor);
        company.setMainPromotion1Title(this.mainPromotion1Title);
        company.setMainPromotion1Content(this.mainPromotion1Content);
        company.setMainPromotion2Title(this.mainPromotion2Title);
        company.setMainPromotion2Content(this.mainPromotion2Content);
        return company;
    }


}
