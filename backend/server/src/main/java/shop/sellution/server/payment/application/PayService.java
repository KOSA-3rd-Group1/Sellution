package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.dto.request.CheckAccountReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;
import shop.sellution.server.payment.infrastructure.PgTokenClient;

import java.time.Duration;
import java.util.Map;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayService {

    private final PgTokenClient pgTokenClient;
    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(10);

    @Transactional
    public void pay(CheckAccountReq checkAccountReq, int price) {
        log.info("결제 시작");
        // 외부 pg사 에 결제 요청  [ pg사 에서는 입력받은 실계좌 인증 후 결제가 진행된다. ]
        pgTokenClient.getApiAccessToken(price)
                .flatMap(apiAccessToken -> {
                    Map<String, String> body = Map.of(
                            "bankCode", checkAccountReq.getBankCode(),
                            "accountNumber", checkAccountReq.getAccountNumber(),
                            "price", Integer.toString(price)
                    );
                    return webClient.post()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/pay")
                                    .build()
                            )
                            .header("Authorization", apiAccessToken)
                            .bodyValue(body)
                            .retrieve()
                            .onStatus(HttpStatusCode::is4xxClientError, response -> { // 4xx 에러에 대한 처리
                                log.error("4xx error 발생: {}", response.statusCode());
                                return Mono.error(new BadRequestException(FAIL_TO_GET_API_TOKEN));
                            })
                            .onStatus(HttpStatusCode::is5xxServerError, response -> { // 5xx 에러에 대한 처리
                                log.error("5xx error 발생: {}", response.statusCode());
                                return Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR));
                            })
                            .toBodilessEntity()
                            .timeout(TIMEOUT);
                })
                .doOnSuccess(result -> log.info("결제 성공"))
                .doOnError(error -> log.error("결제 실패", error));

    }
}
