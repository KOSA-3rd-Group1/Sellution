package shop.sellution.server.payment.infrastructure;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.global.exception.ExternalApiException;
import shop.sellution.server.payment.domain.type.TokenType;

import java.time.Duration;
import java.util.Map;

import static shop.sellution.server.global.exception.ExceptionCode.EXTERNAL_SEVER_ERROR;
import static shop.sellution.server.global.exception.ExceptionCode.INTERNAL_SEVER_ERROR;

@Service
@RequiredArgsConstructor
@Slf4j
public class PgTokenClient {

    @Value("${sellutionPg.api-key}")
    private String apiKey;

    @Value("${sellutionPg.client-name}")
    private String clientName;

    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(2);

    // 일회용 결제 관련 토큰 발급
    public String getApiAccessToken(int price, TokenType tokenType) {
        Map<String, String> body = Map.of(
                "name", clientName,
                "apiKey", apiKey,
                "price", Integer.toString(price),
                "permission", tokenType.getPermission()
        );

        log.info("API access Token 발급 시작");
        try {
            ResponseEntity<Void> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/get-token")
                            .build()
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError,
                            error -> {
                                log.error("4xx error occurred during token retrieval");
                                throw new ExternalApiException(INTERNAL_SEVER_ERROR);
                            })
                    .onStatus(HttpStatusCode::is5xxServerError,
                            error -> {
                                log.error("5xx error occurred during token retrieval");
                                throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                            })
                    .toBodilessEntity()
                    .block(TIMEOUT);

            String token = response != null ? response.getHeaders().getFirst("Authorization") : null;
            if (token == null) {
                throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
            }
            log.info("API access Token 발급 성공");
            return token;
        } catch (Exception e) {
            log.error("API access Token 발급 실패", e);
            throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
        }
    }

}
