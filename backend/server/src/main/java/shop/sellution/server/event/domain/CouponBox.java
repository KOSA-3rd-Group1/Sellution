package shop.sellution.server.event.domain;

import jakarta.persistence.*;
import lombok.*;
import shop.sellution.server.customer.domain.Customer;
import shop.sellution.server.global.type.DisplayStatus;

@Entity
@Table(name = "coupon_box")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CouponBox {
    @EmbeddedId //이 키를 복합 키로 사용함
    private CouponBoxId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("eventId")  //외래 키 필드와 복합 키 필드 매핑; (복합키 사용하여 외래키와 엔티티 관계 매핑 시 사용 >> 외래 키 필드가 직접적으로 변경되지 않음을 보장)
    @JoinColumn(name = "event_id")
    private CouponEvent couponEvent;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("customerId")
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DisplayStatus isUsed = DisplayStatus.N;

    // 쿠폰 사용처리
    public void useCoupon() {
        this.isUsed = DisplayStatus.Y;
    }

    // 쿠폰 미사용처리
    public void unUseCoupon() {
        this.isUsed = DisplayStatus.N;
    }


}
