package shop.sellution.server.company.dto;


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
public class FindCompanySaleSettingRes {
    private Long companyId;
    private DeliveryType serviceType;
    private SellType sellType;
    private SubscriptionType subscriptionType;

    private List<Long> categoryIds;
    private List<Long> productIds;

    private Integer minDeliveryCount;
    private Integer maxDeliveryCount;

    private List<FindOptionRes> monthValues;
    private List<FindOptionRes> weekValues;
    private List<FindOptionRes> dayValues;

    public static FindCompanySaleSettingRes fromEntity(Company company, List<FindOptionRes> monthValues, List<FindOptionRes> weekValues, List<FindOptionRes> dayValues, List<Long> categoryIds, List<Long> productIds) {
        FindCompanySaleSettingRes.FindCompanySaleSettingResBuilder builder = FindCompanySaleSettingRes.builder()
                .companyId(company.getCompanyId())
                .serviceType(company.getServiceType())
                .sellType(company.getSellType())
                .subscriptionType(company.getSubscriptionType())
                .minDeliveryCount(company.getMinDeliveryCount())
                .maxDeliveryCount(company.getMaxDeliveryCount())
                .monthValues(monthValues)
                .weekValues(weekValues)
                .dayValues(dayValues);

        if (company.getSellType() == SellType.CATEGORY) {
            builder.categoryIds(categoryIds);
        } else if (company.getSellType() == SellType.EACH) {
            builder.productIds(productIds);
        }

        return builder.build();
    }

}
