package shop.sellution.server.global;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.company.domain.type.SellType;
import shop.sellution.server.company.domain.type.SubscriptionType;
import shop.sellution.server.contractcompany.domain.ContractCompany;
import shop.sellution.server.contractcompany.domain.ContractCompanyRepository;
import shop.sellution.server.global.type.DeliveryType;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;
    private final CompanyRepository companyRepository;
    private final ContractCompanyRepository contractCompanyRepository;



    Company company;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        createCompany();
        createContractCompany();





        alreadySetup = true;
    }



    private void createCompany() {
        company = Company.builder()
                .displayName("Pocket Salad")
                .name("PocketSalad")
                .isShopVisible(DisplayStatus.Y)
                .isAutoApproved(DisplayStatus.N)
                .isNewMemberEvent(DisplayStatus.N)
                .serviceType(DeliveryType.BOTH)
                .subscriptionType(SubscriptionType.MONTH)
                .minDeliveryCount(5)
                .maxDeliveryCount(30)
                .themeColor("F37021")
                .sellType(SellType.ALL)
                .mainPromotion1Title("한끼, 건강하고 간단하게 \uD83E\uDD57")
                .mainPromotion1Content("최고의 퀄리티를 위해\n아끼지 않고 가득 담았습니다.")
                .mainPromotion2Title("식단 관리 할 사람!")
                .mainPromotion2Content("너랑!  나랑!")
                .build();
        companyRepository.save(company);
    }

    private void createContractCompany() {
        ContractCompany contractCompany = ContractCompany.builder()
                .company(company)
                .contractCompanyName("PocketSalad")
                .contractAuthId("PocketSalad-Auth001")
                .contractAuthPassword("sellution1234")
                .businessRegistrationNumber("346-88-00170")
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build();

        contractCompanyRepository.save(contractCompany);
    }

    private void createCompanyImage() {

    }
}
