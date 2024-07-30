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
    private String qrCodeUrl;

    public static FindCompanyUrlSettingRes fromEntity(Company company) {
        return FindCompanyUrlSettingRes.builder()
                .companyId(company.getCompanyId())
                .name(company.getName())
                .shopUrl(company.getShopUrl())
                .qrCodeUrl(company.getQrCodeUrl())
                .isShopVisible(company.getIsShopVisible().name())
                .build();
    }
}
