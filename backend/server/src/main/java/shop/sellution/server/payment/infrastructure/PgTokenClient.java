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
    private final Duration TIMEOUT = Duration.ofSeconds(10);

    // 일회용 결제 토큰 발급
    public Mono<String> getApiAccessToken(int price) {

        Map<String, String> body = Map.of(
                "name", clientName,
                "apiKey", apiKey,
                "permission", "payment",
                "price",Integer.toString(price)
        );

        log.info(" API access Token 발급 시작");
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/get-token")
                        .build()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus( // 상태코드가 4xx 일경우 예외 발생
                        HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new ExternalApiException(INTERNAL_SEVER_ERROR)))
                .onStatus( // 상태코드가 5xx 일경우 예외발생
                        HttpStatusCode::is5xxServerError,
                        response -> Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR)))
                .toEntity(ResponseEntity.class)
                .timeout(TIMEOUT) // 네트워크로 인한 무한대기를 막기위해 10초 타임아웃 설정
                .mapNotNull(responseEntity -> responseEntity.getHeaders().getFirst("Authorization"))
                .doOnSuccess(token -> log.info("API access Token 발급 성공"))
                .doOnError(error -> log.error("API access Token 발급 실패", error));
    }

}
