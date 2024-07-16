package shop.sellution.server.contractcompany.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.contractcompany.application.ContractCompanyService;
import shop.sellution.server.contractcompany.dto.request.FindContractCompanyReq;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.contractcompany.dto.response.FindContractCompanyRes;

import java.util.Map;

@RestController
@RequestMapping("/api/contract-company")
@RequiredArgsConstructor
public class ContractCompanyController {

    private  final ContractCompanyService contractCompanyService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Long>> saveContractCompany(@Valid @RequestBody SaveContractCompanyReq request) {
        Long contractCompanyId = contractCompanyService.saveContractCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", contractCompanyId));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<FindContractCompanyRes> findContractCompany(@Valid @RequestBody FindContractCompanyReq request) {
        FindContractCompanyRes findContractCompanyRes = contractCompanyService.findContractCompany(request);
        return ResponseEntity.status(HttpStatus.OK).body(findContractCompanyRes);
    }
}
