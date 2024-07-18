package shop.sellution.server.company.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import shop.sellution.server.company.application.CustomerCompanyService;

@Controller
@RequiredArgsConstructor
@RequestMapping("/company")
public class CustomerCompanyController {
    private final CustomerCompanyService customerCompanyService;
    @GetMapping("/{name}")
    public ResponseEntity<Long> findCompanyIdByName(String name){
        return ResponseEntity.ok(customerCompanyService.findCompanyIdByName(name));
    }
}
