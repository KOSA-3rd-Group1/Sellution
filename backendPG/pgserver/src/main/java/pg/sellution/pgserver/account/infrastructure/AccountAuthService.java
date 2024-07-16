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
import reactor.core.publisher.Mono;

import static pg.sellution.pgserver.global.exception.ExceptionCode.EXTERNAL_SEVER_ERROR;
import static pg.sellution.pgserver.global.exception.ExceptionCode.INVALID_ACCOUNT_INFO;


@Service
@RequiredArgsConstructor
@Slf4j
public class AccountAuthService {

    private final IamPortTokenClient iamPortTokenClient;
    private final WebClient webClient;

    public Mono<CheckAccountRes> checkAccount(CheckAccountReq checkAccountReq) {
        // [ 추가 ] 로그인한 유저의 이름을 받아서, 현재 입력된 계좌 주인과 비교하는 로직 추가해야한다.

        log.info("Checking account for bank code: {} , bank num: {}",
                checkAccountReq.getBankCode(), checkAccountReq.getAccountNumber());

        return iamPortTokenClient.getApiAccessToken() // API 액세스 토큰을 비동기적으로 가져옵니다.
                .flatMap(apiAccessToken -> { // 토큰을 받아서 다음 비동기 작업을 수행합니다.
                    log.debug("Received API access token");
                    return webClient.get()
                            .uri(uriBuilder -> uriBuilder // URI를 동적으로 구성합니다.
                                    .path("/vbanks/holder")
                                    .queryParam("bank_code", checkAccountReq.getBankCode())
                                    .queryParam("bank_num", checkAccountReq.getAccountNumber())
                                    .build())
                            .header("Authorization", "Bearer " + apiAccessToken) // 인증 헤더를 설정합니다.
                            .retrieve() // 응답을 가져옵니다.
                            .onStatus(HttpStatusCode::is4xxClientError, response -> { // 4xx 에러에 대한 처리
                                log.error("4xx error occurred: {}", response.statusCode());
                                return Mono.error(new BadRequestException(INVALID_ACCOUNT_INFO));
                            })
                            .onStatus(HttpStatusCode::is5xxServerError, response -> { // 5xx 에러에 대한 처리
                                log.error("5xx error occurred: {}", response.statusCode());
                                return Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR));
                            })
                            .bodyToMono(JsonNode.class); // 응답 본문을 JsonNode 로 변환합니다.
                })
                .map(jsonNode -> new CheckAccountRes(jsonNode.path("response").path("bank_holder").asText())) // JSON에서 필요한 정보를 추출하여 DTO로 변환합니다.
                .doOnSuccess(result -> log.info("Successfully checked account, bankHolder: {}", result.getBankHolderName()))
                .doOnError(error -> log.info("Error occurred while checking account"));
    }

}
