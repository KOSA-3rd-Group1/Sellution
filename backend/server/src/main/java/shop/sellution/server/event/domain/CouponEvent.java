package shop.sellution.server.event.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.event.domain.type.TargetCustomerType;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "coupon_event")
public class CouponEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 50)
    private String couponName;

    @Column(nullable = false)
    private int couponDiscountRate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20,nullable = false)
    private TargetCustomerType targetCustomerType;

    @Column(nullable = false)
    private LocalDateTime eventStartDate;

    @Column(nullable = false)
    private LocalDateTime eventEndDate;

}