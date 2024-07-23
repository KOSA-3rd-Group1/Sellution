package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.domain.type.TokenType;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.infrastructure.PgTokenClient;

import java.time.Duration;
import java.util.Map;

import static shop.sellution.server.global.exception.ExceptionCode.*;
import static shop.sellution.server.global.exception.ExceptionCode.EXTERNAL_SEVER_ERROR;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentCancelService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final PgTokenClient pgTokenClient;
    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(10);


    public void cancelPayment(PaymentReq paymentReq) {
        log.info("결제 취소 시작");

        // 외부 pg사 에 결제 요청  [ pg사 에서는 입력받은 실계좌 인증 후 결제취소가 진행된다. ]

        Account account = accountRepository.findById(paymentReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
        Order order = orderRepository.findById(paymentReq.getOrderId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));

        // 이미 배송 완료인 주문은 취소[환불]가 불가능하다.
        if (order.getDeliveryStatus() == DeliveryStatus.COMPLETE) {
            throw new BadRequestException(ALREADY_DELIVERED);
        }


        pgTokenClient.getApiAccessToken(order.getPerPrice(), TokenType.PAYMENT_CANCEL)
                .flatMap(apiAccessToken -> {
                    Map<String, String> body = Map.of(
                            "bankCode", account.getBankCode(),
                            "accountNumber", account.getAccountNumber(),
                            "price", Integer.toString(order.getPerPrice())
                    );
                    return webClient.post()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/pay/cancel")
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
                .doOnSuccess(result -> {
                    createRefundPaymentHistory(order, account);
                    log.info("결제 취소 성공");
                })
                .doOnError(error -> {
                    log.error("결제 취소 실패", error);
                });
    }


    public void createRefundPaymentHistory(Order order, Account account) {
        log.info("환불 결제 내역 생성 시작");

        int price = order.getPerPrice();

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(price)
                .status(PaymentStatus.CANCEL)
                .type(order.getType())
                .totalPaymentCount(order.getTotalDeliveryCount())
                .remainingPaymentCount(order.getRemainingDeliveryCount())
                .build();

        paymentHistoryRepository.save(paymentHistory);
        log.info("환불 결제 내역 생성 완료");
    }


}
