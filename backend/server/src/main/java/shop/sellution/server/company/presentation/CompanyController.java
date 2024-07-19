package shop.sellution.server.company.presentation;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.company.application.CompanyDisplaySettingServiceImpl;
import shop.sellution.server.company.application.CompanySaleSettingServiceImpl;
import shop.sellution.server.company.application.CompanyUrlSettingServiceImpl;
import shop.sellution.server.company.dto.*;

@RestController
//@RequestMapping("/sellsolution")
public class CompanyController {
    private final CompanyUrlSettingServiceImpl clientCompanyService;
    private final CompanyDisplaySettingServiceImpl clientCompanyDisplayService;
    private final CompanySaleSettingServiceImpl clientCompanySaleService;

    public CompanyController(CompanyUrlSettingServiceImpl clientCompanyService, CompanyDisplaySettingServiceImpl clientCompanyDisplayService, CompanySaleSettingServiceImpl clientCompanySaleService) {
        this.clientCompanyService = clientCompanyService;
        this.clientCompanyDisplayService = clientCompanyDisplayService;
        this.clientCompanySaleService = clientCompanySaleService;
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

    @PutMapping("/display-setting")
    public ResponseEntity<Void> updateCompanyDisplaySetting(@RequestBody SaveCompanyDisplaySettingReq saveCompanyDisplaySettingReq) {
        clientCompanyDisplayService.updateCompanyDisplaySetting(saveCompanyDisplaySettingReq);
        return ResponseEntity.ok().build();
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







}
