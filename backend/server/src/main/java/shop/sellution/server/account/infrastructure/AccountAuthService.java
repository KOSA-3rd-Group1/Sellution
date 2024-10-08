package shop.sellution.server.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
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
    private final Duration TIMEOUT = Duration.ofSeconds(5);

    public CheckAccountRes checkAccount(CheckAccountReq checkAccountReq) {

        log.info("계좌인증 시작 - 은행 코드: {} , 계좌번호: {}",
                checkAccountReq.getBankCode(), checkAccountReq.getAccountNumber());
        Map<String, String> body = Map.of(
                "bankCode", checkAccountReq.getBankCode(),
                "accountNumber", checkAccountReq.getAccountNumber()
        );

        JsonNode jsonNode = webClient.post()
                .uri(uriBuilder -> uriBuilder
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

    }

}


