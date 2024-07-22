package shop.sellution.server.payment.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.domain.type.TokenType;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.infrastructure.PgTokenClient;

import java.time.Duration;
import java.util.Map;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final PgTokenClient pgTokenClient;
    private final WebClient webClient;
    private final Duration TIMEOUT = Duration.ofSeconds(2);


    @Transactional
    public void pay(PaymentReq paymentReq) {
        log.info("결제 시작");

        Account account = accountRepository.findById(paymentReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
        Order order = orderRepository.findByOrderId(paymentReq.getOrderId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));


        String token = pgTokenClient.getApiAccessToken(order.getPerPrice(), TokenType.PAYMENT);


        ResponseEntity<Void> response = webClient.post()
                .uri("/pay")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "bankCode", account.getBankCode(),
                        "accountNumber", account.getAccountNumber(),
                        "price", Integer.toString(order.getPerPrice())
                )).retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, error -> {
                    log.error("4xx error 발생");
                    throw new BadRequestException(FAIL_TO_PAY);
                })
                .onStatus(HttpStatusCode::is5xxServerError, error -> {
                    log.error("5xx error 발생");
                    throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                })
                .toBodilessEntity()
                .block(TIMEOUT);


        if (response != null && response.getStatusCode() == HttpStatus.OK) {
            createSuccessPaymentHistory(order, account);
            if (order.getCustomer().getType() == CustomerType.DORMANT || order.getCustomer().getType() == CustomerType.NEW) {
                order.getCustomer().changeToNormalCustomer();
            }
            log.info("결제 성공");
        } else {
            createFailPaymentHistory(order, account);
            log.info("결제 실패");
        }


    }

//    @Transactional
//    public void pay(PaymentReq paymentReq) {
//        log.info("결제 시작");
//        // 외부 pg사 에 결제 요청  [ pg사 에서는 입력받은 실계좌 인증 후 결제가 진행된다. ]
//
//        Account account = accountRepository.findById(paymentReq.getAccountId())
//                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
//        Order order = orderRepository.findByOrderId(paymentReq.getOrderId())
//                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));
//
//        pgTokenClient.getApiAccessToken(order.getPerPrice(), TokenType.PAYMENT)
//                .flatMap(apiAccessToken -> {
//                    Map<String, String> body = Map.of(
//                            "bankCode", account.getBankCode(),
//                            "accountNumber", account.getAccountNumber(),
//                            "price", Integer.toString(order.getPerPrice())
//                    );
//                    return webClient.post()
//                            .uri(uriBuilder -> uriBuilder
//                                    .path("/pay")
//                                    .build()
//                            )
//                            .header("Authorization", apiAccessToken)
//                            .bodyValue(body)
//                            .retrieve()
//                            .onStatus(HttpStatusCode::is4xxClientError, response -> { // 4xx 에러에 대한 처리
//                                log.error("4xx error 발생: {}", response.statusCode());
//                                return Mono.error(new BadRequestException(FAIL_TO_GET_API_TOKEN));
//                            })
//                            .onStatus(HttpStatusCode::is5xxServerError, response -> { // 5xx 에러에 대한 처리
//                                log.error("5xx error 발생: {}", response.statusCode());
//                                return Mono.error(new ExternalApiException(EXTERNAL_SEVER_ERROR));
//                            })
//                            .toBodilessEntity()
//                            .timeout(TIMEOUT);
//                })
//                .doOnSuccess(result -> {
//                    createSuccessPaymentHistory(order,account);
//                    if(order.getCustomer().getType() == CustomerType.DORMANT || order.getCustomer().getType() == CustomerType.NEW){
//                        order.getCustomer().changeToNormalCustomer(); // 결제 성공시 일반회원으로 변경
//                    }
//                    log.info("결제 성공");
//                })
//                .doOnError(error -> {
//                    createFailPaymentHistory(order,account);
//                    log.error("결제 실패", error);
//                });
//    }

    @Transactional
    public void createSuccessPaymentHistory(Order order, Account account) {
        log.info("성공 결제 내역 생성 시작");

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(order.getPerPrice())
                .status(PaymentStatus.COMPLETE)
                .type(order.getType())
                .totalPaymentCount(order.getTotalDeliveryCount())
                .remainingPaymentCount(order.getRemainingDeliveryCount() - 1) // 남은 배송횟수 -1 이 남은 결제 횟수
                .build();
        paymentHistoryRepository.save(paymentHistory);

        log.info("성공 결제 내역 생성 완료");
    }

    @Transactional
    public void createFailPaymentHistory(Order order, Account account) {
        log.info("실패 결제 내역 생성 시작");

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(order.getPerPrice())
                .status(PaymentStatus.PENDING)
                .type(order.getType())
                .totalPaymentCount(order.getTotalDeliveryCount())
                .remainingPaymentCount(order.getRemainingDeliveryCount())
                .build();
        paymentHistoryRepository.save(paymentHistory);
        log.info("실패 결제 내역 생성 완료");

    }
}
