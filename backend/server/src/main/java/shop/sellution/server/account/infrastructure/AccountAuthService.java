package shop.sellution.server.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;

import java.time.Duration;
import java.util.Map;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountAuthService {

    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(2);

    public CheckAccountRes checkAccount(CheckAccountReq checkAccountReq) {

        log.info("계좌인증 시작 - bank code: {} , bank num: {}",
                checkAccountReq.getBankCode(), checkAccountReq.getAccountNumber());
        Map<String, String> body = Map.of(
                "bankCode", checkAccountReq.getBankCode(),
                "accountNumber", checkAccountReq.getAccountNumber()
        );


        JsonNode jsonNode = webClient.post()
                .uri(uriBuilder -> uriBuilder // URI를 동적으로 구성합니다.
                        .path("/accounts/auth/check-account")
                        .build()
                )
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, error -> {
                    log.warn("4xx error occurred: {}", error.statusCode());
                    throw new BadRequestException(INVALID_ACCOUNT_INFO);
                })
                .onStatus(HttpStatusCode::is5xxServerError, error -> {
                    log.error("5xx error occurred: {}", error.statusCode());
                    throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                })
                .bodyToMono(JsonNode.class)
                .block(TIMEOUT);

        if (jsonNode == null || !jsonNode.has("bankHolderName")) {
            throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
        }

        String bankHolderName = jsonNode.get("bankHolderName").asText();
        log.info("계좌 인증 성공, 계좌주인이름 : {}", bankHolderName);
        return new CheckAccountRes(bankHolderName);


//        return webClient.post()
//                .uri(uriBuilder -> uriBuilder // URI를 동적으로 구성합니다.
//                        .path("/accounts/auth/check-account")
//                        .build()
//                )
//                .bodyValue(body)
//                .retrieve() // 응답을 가져옵니다.
//                .onStatus(HttpStatusCode::is4xxClientError, response -> { // 4xx 에러에 대한 처리
//                    log.error("4xx error occurred: {}", response.statusCode());
//                    return Mono.error(new BadRequestException(INVALID_ACCOUNT_INFO));
//                })
//                .onStatus(HttpStatusCode::is5xxServerError, response -> { // 5xx 에러에 대한 처리
//                    log.error("5xx error occurred: {}", response.statusCode());
//                    return Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR));
//                })
//                .bodyToMono(JsonNode.class) // 응답 본문을 JsonNode 로 변환합니다.
//                .map(jsonNode -> new CheckAccountRes(jsonNode.path("bankHolderName").asText())) // JSON에서 필요한 정보를 추출하여 DTO로 변환합니다;
//                .timeout(TIMEOUT)
//                .doOnSuccess(result -> log.info("계좌 인증 성공, 계좌주인이름 : {}", result.getBankHolderName()))
//                .doOnError(error -> log.info("계좌 인증 실패"));
    }

}


