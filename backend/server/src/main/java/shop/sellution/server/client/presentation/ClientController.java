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
import shop.sellution.server.client.dto.request.SaveClientReq;

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
}
