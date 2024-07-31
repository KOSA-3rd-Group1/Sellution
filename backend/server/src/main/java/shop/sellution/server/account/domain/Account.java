package shop.sellution.server.account.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDateTime;

import static shop.sellution.server.global.type.DisplayStatus.N;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Account {

    @Id
    @Column(name = "account_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id",nullable = false)
    private Customer customer;

//    @Column(nullable = false, length = 100, unique = true)
    @Column(nullable = false, length = 100) // 더미데이터를 위해 unique 제약 제거
    private String accountNumber;

    @Column(nullable = true, length = 64, unique = true)
    private String accountHash;

    @Column(nullable = false, length = 20)
    private String bankCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_deleted",length = 1,nullable = false,columnDefinition = "ENUM('N','Y') DEFAULT 'N'" )
    private DisplayStatus isDeleted = N;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Account(Customer customer, String accountNumber, String accountHash, String bankCode) {
        this.customer = customer;
        this.accountNumber = accountNumber;
        this.accountHash = accountHash;
        this.bankCode = bankCode;
    }

    // 수정 메소드
    public void update(String accountNumber, String accountHash, String bankCode) {
        this.accountNumber = accountNumber;
        this.accountHash = accountHash;
        this.bankCode = bankCode;
    }

    // 삭제 메소드
    public void delete() {
        this.isDeleted = DisplayStatus.Y;
    }

    // 복구 메소드
    public void restore() {
        this.isDeleted = DisplayStatus.N;
    }

}
