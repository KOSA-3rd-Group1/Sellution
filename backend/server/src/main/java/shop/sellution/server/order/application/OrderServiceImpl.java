package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.*;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.order.domain.type.OrderStatus;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.response.FindOrderRes;
import shop.sellution.server.payment.application.PaymentCancelService;
import shop.sellution.server.payment.domain.PaymentHistory;
import shop.sellution.server.payment.domain.repository.PaymentHistoryRepository;
import shop.sellution.server.payment.dto.request.PaymentReq;

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

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));

        if (order.getStatus() == OrderStatus.APPROVED) {
            throw new BadRequestException(ALREADY_APPROVED_ORDER);
        }
        order.approveOrder();

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

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_COMPANY_ID));

        if (order.getStatus() == OrderStatus.CANCEL) {
            throw new BadRequestException(ALREADY_CANCEL_ORDER);
        }

        order.cancelOrder();

        /*
        남은 결제횟수가 남은 배송 횟수보다 1작다면 곧 있을 배송을 위해 결제가 된 주문인것이다.
        그런 주문에는 주문 취소 이후 결제 취소가 이어진다.
         */
        PaymentHistory paymentHistory = paymentHistoryRepository.findFirstByOrderIdOrderByCreatedAtDesc(orderId);
        if (paymentHistory != null) {
            if(paymentHistory.getRemainingPaymentCount() < order.getRemainingDeliveryCount())
            paymentCancelService.cancelPayment(
                    PaymentReq.builder()
                            .orderId(orderId)
                            .customerId(cancelOrderReq.getCustomerId())
                            .accountId(cancelOrderReq.getAccountId())
                            .build()
            );
        }

        log.info("주문 취소 완료");
    }

}
