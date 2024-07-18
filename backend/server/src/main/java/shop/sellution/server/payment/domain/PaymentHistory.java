package shop.sellution.server.payment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.global.type.DisplayStatus;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.payment.domain.type.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_history_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "is_success", nullable = false, length = 1)
    private DisplayStatus isSuccess;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('COMPLETE','CANCEL_REFUND','FAIL_MONEY')")
    private PaymentStatus status;

    @Column(nullable = false)
    private int price;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

}