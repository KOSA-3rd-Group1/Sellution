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

    private List<Integer> monthValues;
    private List<Integer> weekValues;
    private List<String> dayValues;

    public static FindCompanySaleSettingRes fromEntity(Company company, List<Integer> monthValues, List<Integer> weekValues, List<String> dayValues) {
        return FindCompanySaleSettingRes.builder()
                .companyId(company.getCompanyId())
                .serviceType(company.getServiceType())
                .sellType(company.getSellType())
                .subscriptionType(company.getSubscriptionType())
                .minDeliveryCount(company.getMinDeliveryCount())
                .maxDeliveryCount(company.getMaxDeliveryCount())
                .monthValues(monthValues)
                .weekValues(weekValues)
                .dayValues(dayValues)
                .build();
    }

}
