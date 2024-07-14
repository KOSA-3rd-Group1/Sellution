package shop.sellution.server.sms.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.sms.application.SmsAuthNumberService;
import shop.sellution.server.sms.application.SmsService;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import java.util.Map;

@RestController
@RequestMapping("/phones/verify-code")
@RequiredArgsConstructor
public class SmsController {

    private final SmsService smsService;
    private final SmsAuthNumberService smsAuthNumberService;

    /**
     * 메시지 발송
     */
//    @PostMapping("/send")
//    public ResponseEntity<Map<String, String>> sendSms(@Valid @RequestBody SendSmsReq request) {
//        ResponseEntity<Map<String, String>> response = smsService.sendSms(request);
//        return response;
//    }

    /**
     * SMS를 통해 인증 번호를 발송 (테스트)
     *
     * @param request SMS 인증 번호 발송 요청 정보를 담은 객체
     * @return 발송 결과를 담은 ResponseEntity.
     *         성공 시 OK(200) 상태와 성공 메시지를 반환.
     *         실패 시 TOO_MANY_REQUESTS(429) 상태와 에러 메시지를 반환.
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendSms(@Valid @RequestBody SendSmsAuthNumberReq request) {

        try {
            smsAuthNumberService.sendSmsAuthNumber(request);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> verifySms(@Valid @RequestBody VerifySmsAuthNumberReq request) {

        try {
            smsAuthNumberService.verifySmsAuthNumber(request);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of("success", "인증이 완료되었습니다.."));
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }
}
