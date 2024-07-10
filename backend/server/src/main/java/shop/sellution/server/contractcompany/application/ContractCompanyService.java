package shop.sellution.server.contractcompany.application;

import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;

public interface ContractCompanyService {
    // 계약 사업체 등록
    Long saveContractCompany(SaveContractCompanyReq request);

    // 계약 사업체 인증 확인 - ID, PW
    // 계약 사업체 조회
}
