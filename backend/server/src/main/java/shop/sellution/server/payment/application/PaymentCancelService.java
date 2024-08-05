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
import shop.sellution.server.account.application.AccountServiceImpl;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
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
import shop.sellution.server.payment.util.PaymentUtil;
import shop.sellution.server.sms.application.SmsService;

import java.time.Duration;
import java.time.LocalDate;
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
    private final PaymentUtil paymentUtil;
    private final SmsService smsService;
    private final CustomerRepository customerRepository;
    private final AccountServiceImpl accountService;
    private final Duration TIMEOUT = Duration.ofSeconds(2);


    public void cancelPayment(PaymentReq paymentReq) {
        log.info("결제 취소 시작");

        // 외부 pg사 에 결제 취소 요청  [ pg사 에서는 입력받은 실계좌 인증 후 결제취소가 진행된다. ]

        Account account = accountRepository.findById(paymentReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
        Order order = orderRepository.findById(paymentReq.getOrderId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));
        Customer customer = customerRepository.findById(paymentReq.getCustomerId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        // 이미 배송 완료인 주문은 취소[환불]가 불가능하다.
        if (order.getDeliveryStatus() == DeliveryStatus.COMPLETE) {
            throw new BadRequestException(ALREADY_DELIVERED);
        }
        int payCost = paymentUtil.calculateRefundCost(order);
        String token = pgTokenClient.getApiAccessToken(payCost, TokenType.PAYMENT_CANCEL);
        String decryptedAccountNumber = accountService.getDecryptedAccountNumber(account.getAccountNumber());
        log.info("결제 계좌번호 복호화 완료 {}",decryptedAccountNumber);

        ResponseEntity<Void> response = webClient.post()
                .uri("/pay/cancel")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "bankCode", account.getBankCode(),
                        "accountNumber", decryptedAccountNumber,
                        "price", Integer.toString(payCost)
                ))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, error -> {
                    log.error("4xx error 발생 : {}",error.statusCode());
                    throw new BadRequestException(FAIL_TO_PAY_CANCEL);
                })
                .onStatus(HttpStatusCode::is5xxServerError, error -> {
                    log.error("5xx error 발생 : {} ",error.statusCode());
                    throw new ExternalApiException(EXTERNAL_SEVER_ERROR);
                })
                .toBodilessEntity()
                .block(TIMEOUT);

        if(response != null && response.getStatusCode() == HttpStatus.OK) {
            createRefundPaymentHistory(order, account,payCost);
            String payCancelMessage = String.format("""
                    [Sellution] 환불처리 되었습니다.
                    취소된 주문번호
                    %s
                    환불된 금액
                    %d원
                    환불된 계좌 정보
                    %s
                    """,order.getCode(),payCost,account.getAccountNumber());
            smsService.sendSms(customer.getPhoneNumber(),payCancelMessage);
            log.info("결제 취소 성공");
        } else {
            log.error("결제 취소 실패");
        }
    }


    public void createRefundPaymentHistory(Order order, Account account,int price) {
        log.info("환불 결제 내역 생성 시작");

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(price)
                .status(PaymentStatus.CANCEL)
                .type(order.getType())
                .build();

        paymentHistoryRepository.save(paymentHistory);
        log.info("환불 결제 내역 생성 완료");
    }


}
