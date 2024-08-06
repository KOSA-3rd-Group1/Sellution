package pg.sellution.pgserver.account.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pg.sellution.pgserver.account.dto.request.CheckAccountReq;
import pg.sellution.pgserver.account.dto.response.CheckAccountRes;
import pg.sellution.pgserver.global.exception.BadRequestException;
import pg.sellution.pgserver.global.exception.ExternalApiException;

import static pg.sellution.pgserver.global.exception.ExceptionCode.EXTERNAL_SEVER_ERROR;
import static pg.sellution.pgserver.global.exception.ExceptionCode.INVALID_ACCOUNT_INFO;


@Service
@RequiredArgsConstructor
@Slf4j
public class AccountAuthService {

    private final IamPortTokenClient iamPortTokenClient;
    private final WebClient webClient;

    public CheckAccountRes checkAccount(CheckAccountReq checkAccountReq) {
        log.info("---------- 계좌 확인 시작 ----------");
        log.info("입력된값  bank code: {} , bank num: {}",
                checkAccountReq.getBankCode(), checkAccountReq.getAccountNumber());

        String apiAccessToken = iamPortTokenClient.getApiAccessToken();
        log.info("API access token 반환");


        JsonNode response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/vbanks/holder")
                        .queryParam("bank_code", checkAccountReq.getBankCode())
                        .queryParam("bank_num", checkAccountReq.getAccountNumber())
                        .build())
                .header("Authorization", "Bearer " + apiAccessToken)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, error -> {
                    log.warn("4xx error 발생");
                    throw new BadRequestException(INVALID_ACCOUNT_INFO);
                })
                .onStatus(HttpStatusCode::is5xxServerError, error -> {
                    log.error("5xx error 발생");
                    throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                })
                .bodyToMono(JsonNode.class)
                .block();

        if(response == null) {
            log.error("계좌 확인 중 에러 발생");
            throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
        }
        String bankHolderName = response.path("response").path("bank_holder").asText();
        log.info("계좌 인증 성공, 계좌주인 이름 : {}", bankHolderName);
        return new CheckAccountRes(bankHolderName);

    }
}



