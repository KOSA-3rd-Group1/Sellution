package shop.sellution.server.client.presentation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shop.sellution.server.client.application.ClientService;
import shop.sellution.server.client.dto.request.*;
import shop.sellution.server.client.dto.response.FindCurrentClientInfoRes;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.Map;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Long>> registerClient(@Valid @RequestBody SaveClientReq request) {
        Long clientId = clientService.saveClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", clientId));
    }

    @PostMapping("/duplicate-check-id")
    public ResponseEntity<Map<String, Boolean>> checkClientUsername(@Valid @RequestBody CheckClientUsernameReq request) {
        clientService.checkClientUsername(request);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("available", true));
//        try {
//            clientService.checkClientUsername(request);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("available", true));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("available", false));
//        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, FindCurrentClientInfoRes>> getCurrentUser() {
        FindCurrentClientInfoRes response = clientService.getCurrentUserInfo();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", response));
    }

    @PostMapping("/find-id")
    public ResponseEntity<Map<String, String>> findClientId(@Valid @RequestBody FindClientIdReq request) {
        String username = clientService.findClientId(request);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("username", username));
//        try {
//            String username = clientService.findClientId(request);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("username", username));
//        } catch (BadRequestException | AuthException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
//        }
    }

    @PostMapping("/find-id/send")
    public ResponseEntity<Map<String, String>> findClientIdSmsAuthNumber(@Valid @RequestBody FindClientIdSmsAuthNumberReq request) {
        clientService.findClientIdSmsAuthNumber(request);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
//        try {
//            clientService.findClientIdSmsAuthNumber(request);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
//        } catch (AuthException e) {
//            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 오류가 발생했습니다."));
//        }
    }

    @PostMapping("/find-password")
    public ResponseEntity<Map<String, String>> findClientPassword(@Valid @RequestBody FindClientPasswordReq request, HttpServletRequest httpRequest) {
        String token = clientService.findClientPassword(request, httpRequest);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token));
//        try {
//            String token = clientService.findClientPassword(request, httpRequest);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token));
//        } catch (AuthException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
//        }  catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "비밀번호 재설정 오청 중 오류가 발생햇습니다."));
//        }
    }

    @PostMapping("/find-password/send")
    public ResponseEntity<Map<String, String>> findClientPasswordSmsAuthNumber(@Valid @RequestBody FindClientPasswordSmsAuthNumberReq request) {
        clientService.findClientPasswordSmsAuthNumber(request);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
//        try {
//            clientService.findClientPasswordSmsAuthNumber(request);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "인증 번호가 성공적으로 발송되었습니다."));
//        } catch (AuthException e) {
//            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 오류가 발생했습니다."));
//        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changeClientPassword(@Valid @RequestBody ChangeClientPasswordReq request, HttpServletRequest httpRequest) {
        clientService.changeClientPassword(request, httpRequest);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "비밀번호가 성공적으로 변경되었습니다."));
//        try {
//            clientService.changeClientPassword(request, httpRequest);
//            return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", "비밀번호가 성공적으로 변경되었습니다."));
//        } catch (AuthException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
//        }  catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "비밀번호 재설정 오청 중 오류가 발생햇습니다."));
//        }


    }
}
