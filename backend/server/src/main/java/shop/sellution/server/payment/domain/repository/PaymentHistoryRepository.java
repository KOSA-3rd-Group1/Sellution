package shop.sellution.server.payment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import shop.sellution.server.payment.domain.PaymentHistory;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    // 해당 주문의 가장 최근 PaymentHistory 조회
    PaymentHistory findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);
}
