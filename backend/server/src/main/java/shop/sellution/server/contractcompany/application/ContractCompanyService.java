package shop.sellution.server.contractcompany.application;

import shop.sellution.server.contractcompany.dto.request.FindContractCompanyReq;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.contractcompany.dto.response.FindContractCompanyRes;

public interface ContractCompanyService {
    // 계약 사업체 등록
    Long saveContractCompany(SaveContractCompanyReq request);

    // 계약 사업체 인증
    FindContractCompanyRes findContractCompany(FindContractCompanyReq request);

}
