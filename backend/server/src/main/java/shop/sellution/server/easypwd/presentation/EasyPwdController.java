package shop.sellution.server.easypwd.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.easypwd.application.EasyPwdService;
import shop.sellution.server.easypwd.dto.request.EasyPwdReq;

@RestController
@RequiredArgsConstructor
@RequestMapping("/easy-pwd")
public class EasyPwdController {

    private final EasyPwdService easyPwdService;

    // 간편비밀번호 등록,재등록
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<String> registerEasyPwd(@PathVariable Long customerId, @RequestBody EasyPwdReq easyPwdReq) {
        easyPwdService.registerEasyPwd(customerId, easyPwdReq);
        return ResponseEntity.ok().body("success");
    }

    // 간편비밀번호 검증
    @PostMapping("/customer/{customerId}/verify")
    public ResponseEntity<String> verifyEasyPwd(@PathVariable Long customerId, @RequestBody EasyPwdReq easyPwdReq) {
        easyPwdService.verifyEasyPwd(customerId, easyPwdReq);
        return ResponseEntity.ok().body("success");
    }
}
