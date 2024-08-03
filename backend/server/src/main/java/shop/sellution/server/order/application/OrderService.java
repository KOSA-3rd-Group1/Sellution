package shop.sellution.server.order.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import shop.sellution.server.order.dto.OrderSearchCondition;
import shop.sellution.server.order.dto.request.CalculateReq;
import shop.sellution.server.order.dto.request.CancelOrderReq;
import shop.sellution.server.order.dto.response.CalculateRes;
import shop.sellution.server.order.dto.response.FindOrderRes;

public interface OrderService {

    // 특정 회원의 주문 목록 조회
    Page<FindOrderRes> findAllOrderByCustomerId(Long CustomerId,Pageable pageable);

    // 특정 회사의 주문 목록 조회
    Page<FindOrderRes> findAllOrderByCompanyId(Long companyId, OrderSearchCondition condition, Pageable pageable);

    // 주문 수동 승인
    void approveOrder(Long orderId);

    // 주문 자동 승인 토글
    void toggleAutoApprove(Long companyId);

    // 주문 취소
    void cancelOrder(Long orderId,CancelOrderReq cancelOrderReq);

    // 주문 상세조회
    FindOrderRes findOrder(Long orderId);

    // 정기주문(월)을 위한 계산로직
    CalculateRes calculatePrice(CalculateReq calculateReq);

    boolean checkStock(Long orderId);
}
