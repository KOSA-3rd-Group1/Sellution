package shop.sellution.server.company.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.company.application.CustomerCompanyService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/company")
public class CustomerCompanyController {
    private final CustomerCompanyService customerCompanyService;
    @GetMapping("/{name}")
    public ResponseEntity<Long> findCompanyIdByName(@PathVariable String name){
        return ResponseEntity.ok(customerCompanyService.findCompanyIdByName(name));
    }
}
