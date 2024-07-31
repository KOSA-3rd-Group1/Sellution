package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.customer.domain.CustomerRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.DeliveryStatus;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.response.FindOrderRes;
import shop.sellution.server.payment.application.PaymentCancelService;
import shop.sellution.server.payment.application.PaymentService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.dto.request.PaymentReq;
import shop.sellution.server.sms.application.SmsService;

import static shop.sellution.server.global.exception.ExceptionCode.*;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CompanyRepository companyRepository;
    private final PaymentCancelService paymentCancelService;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentService paymentService;
    private final SmsService smsService;
    private final CustomerRepository customerRepository;

    // 특정 회원의 주문 목록 조회
    @Override
    @Transactional(readOnly = true)
    public Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId, Pageable pageable) {

        Page<Order> orders = orderRepository.findAllOrderByCustomerId(CustomerId, pageable);

        return orders.map(order -> FindOrderRes.fromEntities(
                order,
                order.getOrderedProducts(),
                order.getSelectedDays()
        ));

    }

    // 특정 회사의 주문 목록 조회
    @Override
    @Transactional(readOnly = true)
    public Page<FindOrderRes> findAllOrderByCompanyId(Long companyId, OrderSearchCondition condition, Pageable pageable) {

        Page<Order> orders = orderRepository.findOrderByCompanyIdAndCondition(companyId, condition, pageable);

        return orders.map(order -> FindOrderRes.fromEntities(
                order,
                order.getOrderedProducts(),
                order.getSelectedDays()
        ));

    }

    // 주문 수동 승인
    @Override
    public void approveOrder(Long orderId) {
        log.info("주문 승인 시작 [ 수동 ] ");

        Order order = orderRepository.findOrderById(orderId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));

        if (order.getStatus() == OrderStatus.APPROVED) {
            throw new BadRequestException(ALREADY_APPROVED_ORDER);
        }

        String approveMessage = String.format("""
                    [Sellution] 주문이 승인되었습니다. [ 수동 ]
                    승인된 주문번호
                    %s
                    """,order.getCode());
//        smsService.sendSms(order.getCustomer().getPhoneNumber(),approveMessage);

        order.approveOrder();
        paymentService.pay(
                PaymentReq.builder()
                        .orderId(orderId)
                        .customerId(order.getCustomer().getId())
                        .accountId(order.getAccount().getId())
                        .build());

        log.info("주문 승인 완료 [ 수동 ] ");
    }

    // 주문 자동 승인 토글
    @Override
    public void toggleAutoApprove(Long companyId) {
        log.info("주문 승인 시작 [ 자동 ] ");

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));
        company.toggleAutoApproval();

        log.info("주문 승인 완료 [ 자동 ] ");
    }

    // 주문 취소
    @Override
    public void cancelOrder(Long orderId, CancelOrderReq cancelOrderReq) {
        log.info("주문 취소 시작");

        // 해당 주문아이디가 유효한지 확인
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));

        Customer customer = customerRepository.findById(cancelOrderReq.getCustomerId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CUSTOMER));

        // 주문할때 사용했던 계좌인지 확인
        if(!order.getAccount().getId().equals(cancelOrderReq.getAccountId())) {
            throw new BadRequestException(NOT_MATCH_ACCOUNT_ID);
        }

        // 이미 취소된 주문인지 확인
        if (order.getStatus() == OrderStatus.CANCEL) {
            throw new BadRequestException(ALREADY_CANCEL_ORDER);
        }

        // 배송완료된 상태인지 확인
        if (order.getDeliveryStatus() == DeliveryStatus.COMPLETE) {
            throw new BadRequestException(ALREADY_DELIVERED);
        }



        order.cancelOrder();

        /*
        결제를 진행해서 결제내역이 남아있고, 그 결제내역의 내용을 살펴봤을때
        남은 결제횟수가 남은 배송 횟수보다 1작다면 곧 있을 배송을 위해 결제가 된 주문인것이다.
        그런 주문에는 주문 취소 이후 결제 취소가 이어진다.
         */
        PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(orderId);
        if (paymentHistory != null) {
            if(paymentHistory.getRemainingPaymentCount() < order.getRemainingDeliveryCount())
            {
                log.info(" 취소 신청된 주문의 결제내역 : {}", paymentHistory);
                paymentCancelService.cancelPayment(
                        PaymentReq.builder()
                                .orderId(orderId)
                                .customerId(cancelOrderReq.getCustomerId())
                                .accountId(cancelOrderReq.getAccountId())
                                .build()
                );
            }
        }else{
            String cancelMessage = String.format("""
                [Sellution] 주문이 취소되었습니다.
                취소된 주문번호
                %d
                """, order.getId(), order.getTotalPrice());
//            smsService.sendSms(customer.getPhoneNumber(), cancelMessage);
        }

        log.info("주문 취소 완료");
    }

}
