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
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
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
import shop.sellution.server.payment.util.PaymentUtil;
import shop.sellution.server.sms.application.SmsService;

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
    private final PaymentUtil paymentUtil;
    private final WebClient webClient;
    private final SmsService smsService;
    private final CustomerRepository customerRepository;
    private final Duration TIMEOUT = Duration.ofSeconds(2);


    @Transactional
    public void pay(PaymentReq paymentReq) {
        /*
        첫결제는 승인이후 바로시작, 정기주문(월) 경우 다음 결제일은 배송선택일 + 1달
         */
        log.info("결제 시작");

        Account account = accountRepository.findById(paymentReq.getAccountId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ACCOUNT));
        Order order = orderRepository.findByOrderId(paymentReq.getOrderId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));
        Customer customer = customerRepository.findById(paymentReq.getCustomerId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        int payCost = paymentUtil.calculatePayCost(order, order.getDeliveryStartDate()); // 결제 금액 계산
        String token = pgTokenClient.getApiAccessToken(payCost, TokenType.PAYMENT); // 결제 토큰 발급


        ResponseEntity<Void> response = webClient.post()
                .uri("/pay")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "bankCode", account.getBankCode(),
                        "accountNumber", account.getAccountNumber(),
                        "price", Integer.toString(payCost)
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
            createSuccessPaymentHistory(order, account,payCost);
            if (order.getCustomer().getType() == CustomerType.DORMANT || order.getCustomer().getType() == CustomerType.NEW) {
                order.getCustomer().changeToNormalCustomer();
            }
            //이 주문이 월정기주문이고,  현재 결제일 + 1달이 마지막 배송일보다 이전이면 아직 구독기간이 남은것이므로 다음 결제일 설정
            if(order.getType().isMonthSubscription() && order.getDeliveryEndDate().isAfter(order.getNextPaymentDate().plusMonths(1))){
                order.setNextPaymentDate(order.getNextPaymentDate().plusMonths(1).minusDays(7)); // 다음 결제일은 (현재결제일 + 1달)의 일주일전으로 설정
            }
            else{
                order.setNextPaymentDate(null); // 다음 결제일이 없다면 null 로 설정
            }
            order.increasePaymentCount();
            String payMessage = String.format("""
                    [Sellution] 결제가 완료되었습니다.
                    결제된 주문번호
                    %d
                    결제된 금액
                    %d원
                    결제된 계좌 정보
                    %s
                    """,order.getCode(),payCost,account.getAccountNumber());
            smsService.sendSms(customer.getPhoneNumber(),payMessage);
            log.info("결제 성공");
        } else {
            createFailPaymentHistory(order, account,payCost);
            log.info("결제 실패");
        }


    }

    @Transactional
    public void createSuccessPaymentHistory(Order order, Account account,int payCost) {
        log.info("성공 결제 내역 생성 시작");

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(payCost)
                .status(PaymentStatus.COMPLETE)
                .type(order.getType())
                .totalPaymentCount(order.getTotalDeliveryCount())
                .remainingPaymentCount(order.getRemainingDeliveryCount() - 1) // 남은 배송횟수 -1 이 남은 결제 횟수
                .build();
        paymentHistoryRepository.save(paymentHistory);

        log.info("성공 결제 내역 생성 완료");
    }

    @Transactional
    public void createFailPaymentHistory(Order order, Account account,int payCost) {
        log.info("실패 결제 내역 생성 시작");

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .order(order)
                .account(account)
                .price(payCost)
                .status(PaymentStatus.PENDING)
                .type(order.getType())
                .totalPaymentCount(order.getTotalDeliveryCount())
                .remainingPaymentCount(order.getRemainingDeliveryCount())
                .build();
        paymentHistoryRepository.save(paymentHistory);
        log.info("실패 결제 내역 생성 완료");

    }
}
