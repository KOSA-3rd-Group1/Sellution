package pg.sellution.pgserver.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pg.sellution.pgserver.global.exception.ExternalApiException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

import static pg.sellution.pgserver.global.exception.ExceptionCode.EXTERNAL_SEVER_ERROR;
import static pg.sellution.pgserver.global.exception.ExceptionCode.INTERNAL_SEVER_ERROR;


@Service
@Slf4j
@RequiredArgsConstructor
public class IamPortTokenClient {

    @Value("${iamport.api-key}")
    private String apiKey;

    @Value("${iamport.api-secret-key}")
    private String apiSecretKey;

    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(10);

    public Mono<String> getApiAccessToken() {
        log.info("Fetching API access token");

        Map<String, String> body = Map.of(
                "imp_key", apiKey,
                "imp_secret", apiSecretKey
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/users/getToken")
                        .build()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve() // 응답을 가져옵니다.
                .onStatus( // 상태코드가 4xx 일경우 예외 발생
                        HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new ExternalApiException(INTERNAL_SEVER_ERROR)))
                .onStatus( // 상태코드가 5xx 일경우 예외발생
                        HttpStatusCode::is5xxServerError,
                        response -> Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR)))
                .bodyToMono(JsonNode.class) // 응답은 JsonNode로 변환
                .timeout(TIMEOUT) // 네트워크로 인한 무한대기를 막기위해 10초 타임아웃 설정
                .map(jsonNode -> jsonNode.path("response").path("access_token").asText()) // JsonNode에서 access_token 추출
                .doOnSuccess(token -> log.info("Successfully fetched API access token"))
                .doOnError(error -> log.info("Error occurred while fetching API access token"));

    }
}
