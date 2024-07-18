package shop.sellution.server.payment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.order.domain.Order;
import shop.sellution.server.account.domain.Account;
import shop.sellution.server.order.domain.type.OrderType;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('COMPLETE','PENDING','CANCEL')")
    private PaymentStatus status;

    @Column(nullable = false)
    private int price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM ('ONETIME','MONTH_SUBSCRIPTION','COUNT_SUBSCRIPTION')")
    private OrderType type;

    @Column(nullable = false)
    private int totalPaymentCount;

    @Column(nullable = false)
    private int remainingPaymentCount;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public PaymentHistory(Order order, Account account, PaymentStatus status, int price, OrderType type, int totalPaymentCount, int remainingPaymentCount) {
        this.order = order;
        this.account = account;
        this.status = status;
        this.price = price;
        this.type = type;
        this.totalPaymentCount = totalPaymentCount;
        this.remainingPaymentCount = remainingPaymentCount;
    }
}