package shop.sellution.server.client.presentation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.sellution.server.client.application.ClientService;
import shop.sellution.server.client.dto.request.FindClientIdReq;
import shop.sellution.server.client.dto.request.SaveClientReq;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.BadRequestException;

import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Long>> registerClient(@Valid @RequestBody SaveClientReq request) {
        Long clientId = clientService.saveClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", clientId));
    }

    @PostMapping("/find-id")
    public ResponseEntity<Map<String, String>> findClientId(@Valid @RequestBody FindClientIdReq request) {
        try {
            String userName = clientService.findClientId(request);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("username", userName));
        } catch (BadRequestException | AuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
