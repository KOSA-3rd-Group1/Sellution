package shop.sellution.server.company.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.type.DisplayStatus;

@Getter
@Setter
@Builder
public class SaveCompanyUrlSettingReq {
    //1. 사업체명(name), 2. 쇼핑몰 URL(shopUrl) 3. 쇼핑몰 QR 코드 4. 쇼핑몰 공개여부(isShopVisible)
    private Long companyId;
    private String name;
    private String isShopVisible;

    public Company toEntity(Company company) {
        company.setName(this.name);
        company.setShopUrl("https://www.sellution.shop/shopping/" + this.name + "/home");
        company.setIsShopVisible(DisplayStatus.valueOf(this.isShopVisible));
        return company;
    }
}
