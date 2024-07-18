package shop.sellution.server.company.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.global.type.DeliveryType;

import java.util.List;

@Getter
@Setter
@Builder
public class SaveCompanySaleSettingReq {
    private Long companyId;

    @NotBlank
    private DeliveryType serviceType; //단건, 정기, 둘다

    @NotBlank
    private SellType sellType; //전체 상품, 카테고리, 개별 상품

    private List<Long> categories; // sellType 카테고리일때 받아와야함
    private List<Long> products;

    private SubscriptionType subscriptionType; //월단위, 횟수단위, null 가능

    @Min(5)
    @Max(30)
    private int minDeliveryCount;

    @Min(5)
    @Max(30)
    private int maxDeliveryCount;

    private List<String> dayOptions;
    private List<String> weekOptions;
    private List<Integer> monthOptions; //subscriptionType이 MONTH일 경우에만 받아옴

    public Company toEntity(Company company) {
        company.setServiceType(this.serviceType);
        company.setSellType(this.sellType);
        company.setSubscriptionType(this.subscriptionType);
        company.setMinDeliveryCount(this.minDeliveryCount);
        company.setMaxDeliveryCount(this.maxDeliveryCount);
        return company;
    }
}
