package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.util.Base64Util;

@Getter
@Setter
@Builder
public class FindCompanyUrlSettingRes {
    private Long companyId;
    private String name;
    private String shopUrl;
    private String isShopVisible;

    //private byte[] qrCode;
    private String qrCodeBase64;

    public static FindCompanyUrlSettingRes fromEntity(Company company) {
        return FindCompanyUrlSettingRes.builder()
                .companyId(company.getCompanyId())
                .name(company.getName())
                .shopUrl("https://www.sellution.shop/shopping/" + company.getName())
                .isShopVisible(company.getIsShopVisible().name())
                .qrCodeBase64(Base64Util.encodeToString(company.getQrCode()))
                .build();
    }
}
