package shop.sellution.server.company.presentation;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import shop.sellution.server.company.application.CompanySaleSettingServiceImpl;
import shop.sellution.server.company.application.CompanyServiceImpl;
import shop.sellution.server.company.application.CompanyUrlSettingServiceImpl;
import shop.sellution.server.company.dto.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
//@RequestMapping("/sellsolution")
public class CompanyController {
    private final CompanyUrlSettingServiceImpl clientCompanyService;
    private final CompanyDisplaySettingServiceImpl clientCompanyDisplayService;
    private final CompanySaleSettingServiceImpl clientCompanySaleService;
    private final CompanyServiceImpl companyService;

    public CompanyController(CompanyUrlSettingServiceImpl clientCompanyService, CompanyDisplaySettingServiceImpl clientCompanyDisplayService, CompanySaleSettingServiceImpl clientCompanySaleService, CompanyServiceImpl companyService) {
        this.clientCompanyService = clientCompanyService;
        this.clientCompanyDisplayService = clientCompanyDisplayService;
        this.clientCompanySaleService = clientCompanySaleService;
        this.companyService = companyService;
    }

    @GetMapping("/url-setting/{companyId}")
    public ResponseEntity<FindCompanyUrlSettingRes> getCompanyUrlSetting(@PathVariable Long companyId) {
        FindCompanyUrlSettingRes responseDTO = clientCompanyService.getCompanyUrlSetting(companyId);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/url-setting")
    public ResponseEntity<Void> updateCompanyUrlSetting(@Valid @RequestBody SaveCompanyUrlSettingReq saveCompanyUrlSettingReq) {
        clientCompanyService.updateCompanyUrlSetting(saveCompanyUrlSettingReq);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/display-setting/{companyId}")
    public ResponseEntity<FindCompanyDisplaySettingRes> getCompanyDisplaySetting(@PathVariable Long companyId) {
        FindCompanyDisplaySettingRes findCompanyDisplaySettingRes = clientCompanyDisplayService.getCompanyDisplaySetting(companyId);
        return ResponseEntity.ok(findCompanyDisplaySettingRes);
    }

    // multipart/form-data 요청을 처리
    @PutMapping(value = "/display-setting", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateCompanyDisplaySetting(
            @ModelAttribute SaveCompanyDisplaySettingReq requestDTO,
            @RequestParam(value = "logoFile", required = false) MultipartFile logoFile,
            @RequestParam(value = "promotionFiles", required = false) List<MultipartFile> promotionFiles) {
        try {
            clientCompanyDisplayService.updateCompanyDisplaySetting(requestDTO, logoFile, promotionFiles);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sale-setting/{companyId}")
    public ResponseEntity<FindCompanySaleSettingRes> getCompanySaleSetting(@PathVariable Long companyId) {
        FindCompanySaleSettingRes findCompanySaleSettingRes = clientCompanySaleService.getCompanySaleSetting(companyId);
        return ResponseEntity.ok(findCompanySaleSettingRes);
    }

    @PutMapping("/sale-setting")
    public ResponseEntity<Void> updateCompanySaleSetting(@RequestBody SaveCompanySaleSettingReq saveCompanySaleSettingReq) {
        clientCompanySaleService.updateCompanySaleSetting(saveCompanySaleSettingReq);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shopping-find-companyId/{companyName}")
    public ResponseEntity<Map<String, FindCompanyInfoRes>> getCompanyInfo(@PathVariable String companyName) {
        FindCompanyInfoRes findCompanyInfo = companyService.findCompanyId(companyName);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", findCompanyInfo));
    }
}
