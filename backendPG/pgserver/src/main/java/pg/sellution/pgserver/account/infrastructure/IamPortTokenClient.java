package pg.sellution.pgserver.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pg.sellution.pgserver.global.exception.BadRequestException;
import pg.sellution.pgserver.global.exception.ExternalApiException;

import java.time.Duration;
import java.util.Map;

import static pg.sellution.pgserver.global.exception.ExceptionCode.*;


@Service
@Slf4j
@RequiredArgsConstructor
public class IamPortTokenClient {

    @Value("${iamport.api-key}")
    private String apiKey;

    @Value("${iamport.api-secret-key}")
    private String apiSecretKey;

    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(2);

    public String getApiAccessToken() {
        log.info("Fetching API access token");

        Map<String, String> body = Map.of(
                "imp_key", apiKey,
                "imp_secret", apiSecretKey
        );

        JsonNode response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/users/getToken")
                        .build()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, error -> {
                    log.error("4xx error 발생");
                    throw new BadRequestException(INVALID_ACCOUNT_INFO);
                })
                .onStatus(HttpStatusCode::is5xxServerError, error -> {
                    log.error("5xx error 발생");
                    throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                })
                .bodyToMono(JsonNode.class)
                .block(TIMEOUT);
        if(response == null) {
            log.error(" API access token 반환 에러");
            throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
        }
        String token = response.path("response").path("access_token").asText();
        log.info("Successfully fetched API access token");
        return token;
    }

}
