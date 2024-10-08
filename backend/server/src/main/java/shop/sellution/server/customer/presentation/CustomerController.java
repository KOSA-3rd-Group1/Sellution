package shop.sellution.server.customer.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import okhttp3.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.customer.application.CustomerService;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.dto.CustomerSearchCondition;
import shop.sellution.server.customer.dto.request.*;
import shop.sellution.server.customer.dto.resonse.FindCurrentCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerInfoRes;
import shop.sellution.server.customer.dto.resonse.FindCustomerRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;

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

    @PostMapping("/duplicate-check-id")
    public ResponseEntity<Map<String, Boolean>> checkCustomerUsername(@Valid @RequestBody CheckCustomerUsernameReq request) {
        try {
            customerService.checkCustomerUsername(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("available", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("available", false));
        }
    }

    @PostMapping("/signup/verify-code/send")
    public ResponseEntity<Boolean> sendSignupSmsAuthNumber(@Valid @RequestBody CheckCustomerPhoneNumberReq request) {
        Boolean result = customerService.checkCustomerPhoneNumber(request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/signup/verify-code")
    public ResponseEntity<Boolean> verifySignupSmsAuthNumber(@Valid @RequestBody FindCustomerSignupSmsAuthNumberReq request) {
        Boolean result = customerService.verifyCustomerSmsAuthNumber(request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, FindCurrentCustomerInfoRes>> getCurrentCustomerInfo() {
        FindCurrentCustomerInfoRes currentCustomerInfo = customerService.getCurrentUserInfo();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", currentCustomerInfo));
    }

    @PostMapping("/find-id")
    public ResponseEntity<Map<String ,String>> findCustomerId(@Valid @RequestBody FindCustomerIdReq request) {
        try {
            String username = customerService.findCustomerId(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("username", username));
        } catch (BadRequestException | AuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/find-id/send")
    public ResponseEntity<Map<String, String>> findCustomerIdSmsAuthNumber(@Valid @RequestBody FindCustomerIdSmsAuthNumberReq request) {
        try {
            customerService.findCustomerIdSmsAuthNumber(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/find-password")
    public ResponseEntity<Map<String, String>> findCustomerPassword(@Valid @RequestBody FindCustomerPasswordReq request, HttpServletRequest httpRequest) {
        try {
            String token = customerService.findCustomerPassword(request, httpRequest);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "비밀번호 재설정 오청 중 오류가 발생햇습니다."));
        }
    }
    @PostMapping("/find-password/send")
    public ResponseEntity<Map<String, String>> findCustomerPasswordSmsAuthNumber(@Valid @RequestBody FindCustomerPasswordSmsAuthNumberReq request) {
        try {
            customerService.findCustomerPasswordSmsAuthNumber(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changeCustomerPassword(@Valid @RequestBody ChangeCustomerPasswordReq request, HttpServletRequest httpRequest) {
        try {
            customerService.changeCustomerPassword(request, httpRequest);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "비밀번호가 성공적으로 변경되었습니다."));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "비밀번호 재설정 오청 중 오류가 발생햇습니다."));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Page<FindCustomerRes>> findAllCustomerByCompanyId(CustomerSearchCondition condition, Pageable pageable) {
        return ResponseEntity.ok(customerService.findAllCustomerByCompanyId(condition, pageable));
    }

    @PostMapping("/self")
    public ResponseEntity<FindCustomerRes> registerCustomerFromClient(@Valid @RequestBody RegisterCustomerReq request) {
        FindCustomerRes findCustomerRes = customerService.registerCustomerFromClient(request);
        return ResponseEntity.status(HttpStatus.OK).body(findCustomerRes);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<FindCustomerRes> findCustomerById(@PathVariable Long customerId) {
        FindCustomerRes findCustomerRes = customerService.getCustomerById(customerId);
        return ResponseEntity.status(HttpStatus.OK).body(findCustomerRes);
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<String> updateCustomer(
            @PathVariable Long customerId,
            @RequestBody @Valid RegisterCustomerReq request
    ) {
        customerService.updateCustomer(customerId, request);
        return ResponseEntity.ok("success");
    }


    @GetMapping("/mypage/{customerId}")
    public ResponseEntity<FindCustomerInfoRes> getCustomerInfo(@PathVariable Long customerId) {
        FindCustomerInfoRes customerInfo = customerService.getCustomerInfo(customerId);
        return ResponseEntity.ok(customerInfo);
    }

    @PostMapping("/{customerId}/send-auth-code")
    public ResponseEntity<?> sendAuthenticationCode(
            @PathVariable Long customerId,
            @RequestBody SendAuthCodeReq sendAuthCodeReq
    ) {
        customerService.sendAuthenticationCode(customerId, sendAuthCodeReq.getName(), sendAuthCodeReq.getPhoneNumber());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{customerId}/verify-auth-code")
    public ResponseEntity<?> verifyAuthenticationCode(
            @PathVariable Long customerId,
            @RequestBody VerifyAuthCodeReq verifyAuthCodeReq
    ) {
        customerService.verifyAuthenticationCode(customerId, verifyAuthCodeReq.getAuthCode());
        return ResponseEntity.ok().build();
    }
}
