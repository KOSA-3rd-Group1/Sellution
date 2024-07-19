package shop.sellution.server.order.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.order.domain.repository.OrderRepository;
import shop.sellution.server.payment.application.PayService;

import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_ORDER;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderApproveService {

    private final OrderRepository orderRepository;
    private final PayService payService;

    @Transactional
    public void approveOrder(Long orderId) {
        log.info("승인 시작");
        // 승인 -> 승인상태를 변경
        // 단건결제,횟수정기배송은 바로 결제 , 월정기배송은 배송일 2일전 결제시도,1일전 결제시도 , 어떤 배송 타입이든 배송일날 재고감소

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_ORDER));

        order.approveOrder();

//        if (order.getType().isOnetime()) { // 단건 주문이라면 주문 승인시 바로 결제
//            payService.pay();
//        }


        log.info("승인 성공");
    }


}
