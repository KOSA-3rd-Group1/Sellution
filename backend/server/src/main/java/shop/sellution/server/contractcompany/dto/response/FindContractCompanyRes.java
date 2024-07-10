package shop.sellution.server.contractcompany.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindContractCompanyRes {

    private Long companyId;
    private String contractCompanyName;
    private String businessRegistrationNumber;
}
