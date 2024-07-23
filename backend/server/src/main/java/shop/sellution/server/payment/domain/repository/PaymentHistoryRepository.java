package shop.sellution.server.payment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import shop.sellution.server.payment.domain.PaymentHistory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentHistoryRepository extends
        JpaRepository<PaymentHistory, Long>,
        PaymentHistoryRepositoryCustom {

    // 해당 주문의 가장 최근 PaymentHistory 조회
    PaymentHistory findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);

    // 해당 주문의 가장 최근 PaymentHistory 조회 , status가 complete이고, 생성일이 파라미터기준 2일이내

    @Query("""
            select ph from PaymentHistory ph
            where ph.order.id = :orderId
            and ph.status = 'COMPLETE'
            and ph.createdAt >= :date
            order by ph.createdAt desc
            limit 1
            """)
    PaymentHistory findAlreadyHasPaymentHistory(Long orderId, LocalDateTime date);

    @Query("""
            select ph from PaymentHistory ph
            where ph.order.id = :orderId
            and ph.status = 'PENDING'
            and ph.createdAt >= :startOfDay
            and ph.createdAt < :endOfDay
            """)
    PaymentHistory findPendingPaymentHistory(Long orderId, LocalDateTime startOfDay,LocalDateTime endOfDay);

}
