package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.Company;

@Getter
@Setter
@Builder
public class FindCompanyUrlSettingRes {
    private Long companyId;
    private String name;
    private String shopUrl;
    private String isShopVisible;

    public static FindCompanyUrlSettingRes fromEntity(Company company) {
        return FindCompanyUrlSettingRes.builder()
                .companyId(company.getCompanyId())
                .name(company.getName())
                .shopUrl("https://www.sellution.com/" + company.getName())
                .isShopVisible(company.getIsShopVisible().name())
                .build();
    }
}
