package shop.sellution.server.customer.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.customer.application.CustomerService;
import shop.sellution.server.customer.dto.request.SaveCustomerReq;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Long>> signupCustomer(@Valid @RequestBody SaveCustomerReq request) {
        Long customerId = customerService.saveCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", customerId));
    }
}
