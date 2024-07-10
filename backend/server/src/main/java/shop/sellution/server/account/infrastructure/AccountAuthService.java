package shop.sellution.server.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.account.dto.response.CheckAccountRes;
import shop.sellution.server.auth.iamport.infrastructure.IamPortTokenClient;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountAuthService {

    private final IamPortTokenClient iamPortTokenClient;
    private final WebClient webClient;

    public Mono<CheckAccountRes> checkAccount(CheckAccountReq checkAccountReq) {
        log.info("Checking account for bank code: {} , bank num: {}",
                checkAccountReq.getBankCode(), checkAccountReq.getBankNum());

        return iamPortTokenClient.getApiAccessToken()
                .flatMap(apiAccessToken -> {
                    log.debug("Received API access token");
                    return webClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/vbanks/holder")
                                    .queryParam("bank_code", checkAccountReq.getBankCode())
                                    .queryParam("bank_num", checkAccountReq.getBankNum())
                                    .build())
                            .header("Authorization", "Bearer " + apiAccessToken)
                            .retrieve()
                            .onStatus(HttpStatusCode::is4xxClientError, response -> {
                                log.error("4xx error occurred: {}", response.statusCode());
                                return Mono.error(new BadRequestException(INVALID_ACCOUNT_INFO));
                            })
                            .onStatus(HttpStatusCode::is5xxServerError, response -> {
                                log.error("5xx error occurred: {}", response.statusCode());
                                return Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR));
                            })
                            .bodyToMono(JsonNode.class);
                })
                .map(jsonNode -> new CheckAccountRes(jsonNode.path("response").path("bank_holder").asText()))
                .doOnSuccess(result -> log.info("Successfully checked account, bankHolder: {}", result.getBankHolderName()))
                .doOnError(error -> log.info("Error occurred while checking account"));
    }

}
