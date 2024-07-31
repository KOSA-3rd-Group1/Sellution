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
import shop.sellution.server.account.application.AccountService;
import shop.sellution.server.account.application.AccountServiceImpl;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.account.domain.AccountRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.customer.domain.type.CustomerType;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExternalApiException;
import shop.sellution.server.order.application.OrderService;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.domain.type.PaymentStatus;
import shop.sellution.server.payment.domain.type.TokenType;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.payment.infrastructure.PgTokenClient;
import shop.sellution.server.payment.util.PayInfo;
import shop.sellution.server.payment.util.PaymentUtil;
import shop.sellution.server.sms.application.SmsService;

import java.time.Duration;
import java.time.LocalDate;
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
    private final AccountServiceImpl accountService;
    private final Duration TIMEOUT = Duration.ofSeconds(2);


    @Transactional
    public boolean pay(PaymentReq paymentReq) {
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

        PayInfo payInfo = paymentUtil.calculatePayCost(order, order.getDeliveryStartDate());// 결제 금액 계산 [ 정기(월)이라면 이번달 결제금액 ,이번달 배송횟수가 반환 ]
        String token = pgTokenClient.getApiAccessToken(payInfo.getPayAmount(), TokenType.PAYMENT); // 결제 토큰 발급
        order.updateThisMonthDeliveryCount(payInfo.getDeliveryCount()); // 이번달 배송횟수 업데이트
        String decryptedAccountNumber = accountService.getDecryptedAccountNumber(account.getAccountNumber());
        log.info("결제 계좌번호 복호화 완료 {}",decryptedAccountNumber);
        ResponseEntity<Void> response = webClient.post()
                .uri("/pay")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "bankCode", account.getBankCode(),
                        "accountNumber", decryptedAccountNumber,
                        "price", Integer.toString(payInfo.getPayAmount())
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
            if (order.getCustomer().getType() == CustomerType.DORMANT || order.getCustomer().getType() == CustomerType.NEW) {
                order.getCustomer().changeToNormalCustomer();
            }
            order.increasePaymentCount(); // 결제횟수 증가
            createSuccessPaymentHistory(order, account,payInfo);




            if(order.getType().isMonthSubscription()) {
                //이 주문이 월정기주문이고, 이번달 구독기간의 끝이 총 구독기간의 끝이아니라면 결제일 갱신
                LocalDate thisSubMonthEndDate = order.getDeliveryStartDate().plusMonths(order.getPaymentCount());
                LocalDate subMonthEndDate = order.getDeliveryStartDate().plusMonths(order.getMonthOptionValue());

                if (!thisSubMonthEndDate.isEqual(subMonthEndDate)) {
                    order.setNextPaymentDate(thisSubMonthEndDate.minusDays(7)); // 다음 결제일은 (현재결제일 + 1달)의 일주일전으로 설정
                }
            }
            else{
                order.setNextPaymentDate(null); // 다음 결제일이 없다면 null 로 설정
            }
            String payMessage = String.format("""
                    [Sellution] 결제가 완료되었습니다.
                    결제된 주문번호
                    %d
                    결제된 금액
                    %d원
                    결제된 계좌 정보
                    %s
                    """,order.getCode(),payInfo.getPayAmount(),account.getAccountNumber());
//            smsService.sendSms(customer.getPhoneNumber(),payMessage);
            log.info("결제 성공");
            return true;
        } else {
            createFailPaymentHistory(order, account,payInfo);
            log.info("결제 실패");
            return false;
        }


    }

    @Transactional
    public void createSuccessPaymentHistory(Order order, Account account,PayInfo payInfo) {
        log.info("성공 결제 내역 생성 시작");

        PaymentHistory paymentHistory= null;
        if (order.getType().isMonthSubscription()) {
            paymentHistory = PaymentHistory.builder()
                    .order(order)
                    .account(account)
                    .status(PaymentStatus.COMPLETE)
                    .price(payInfo.getPayAmount())
                    .type(order.getType())
                    .totalPaymentCount(order.getMonthOptionValue())
                    .remainingPaymentCount(order.getMonthOptionValue() - order.getPaymentCount())
                    .thisSubMonthStartDate(order.getDeliveryStartDate().plusMonths(order.getPaymentCount()-1))
                    .thisSubMonthEndDate(order.getDeliveryStartDate().plusMonths(order.getPaymentCount()))
                    .deliveryPerPrice(order.getPerPrice())
                    .thisMonthDeliveryCount(payInfo.getDeliveryCount())
                    .build();
        }
        else{
            paymentHistory = PaymentHistory.builder()
                    .order(order)
                    .account(account)
                    .status(PaymentStatus.COMPLETE)
                    .price(payInfo.getPayAmount())
                    .type(order.getType())
                    .totalPaymentCount(1)
                    .remainingPaymentCount(0)
                    .build();
        }
        paymentHistoryRepository.save(paymentHistory);

        log.info("성공 결제 내역 생성 완료");
    }

    @Transactional
    public void createFailPaymentHistory(Order order, Account account,PayInfo payInfo) {
        log.info("실패 결제 내역 생성 시작");
        PaymentHistory paymentHistory= null;
        if (order.getType().isMonthSubscription()) {
            paymentHistory = PaymentHistory.builder()
                    .order(order)
                    .account(account)
                    .status(PaymentStatus.PENDING)
                    .price(payInfo.getPayAmount())
                    .type(order.getType())
                    .totalPaymentCount(order.getTotalDeliveryCount())
                    .remainingPaymentCount(order.getRemainingDeliveryCount())
                    .thisSubMonthStartDate(order.getDeliveryStartDate().plusMonths(order.getPaymentCount()))
                    .thisSubMonthEndDate(order.getDeliveryStartDate().plusMonths(order.getPaymentCount() + 1))
                    .deliveryPerPrice(order.getPerPrice())
                    .thisMonthDeliveryCount(payInfo.getDeliveryCount())
                    .build();
        }
        else{
            paymentHistory = PaymentHistory.builder()
                    .order(order)
                    .account(account)
                    .status(PaymentStatus.PENDING)
                    .price(payInfo.getPayAmount())
                    .type(order.getType())
                    .totalPaymentCount(order.getTotalDeliveryCount())
                    .remainingPaymentCount(order.getRemainingDeliveryCount())
                    .build();
        }
        paymentHistoryRepository.save(paymentHistory);
        log.info("실패 결제 내역 생성 완료");

    }
}
