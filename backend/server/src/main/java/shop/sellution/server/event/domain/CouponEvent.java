package shop.sellution.server.event.domain;

import lombok.*;
import jakarta.persistence.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.global.type.DisplayStatus;

import java.time.LocalDate;

@Entity
@Table(name = "coupon_event")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CouponEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id") //coupon_event_id 아님
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 50)
    private String couponName;

    @Column(nullable = false) //int -> Integer
    private Integer couponDiscountRate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20,nullable = false)
    private TargetCustomerType targetCustomerType;

    @Column(nullable = false)
    private LocalDate eventStartDate;

    @Column(nullable = false)
    private LocalDate eventEndDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('UPCOMING','ONGOING','END') default 'UPCOMING'")
    @Builder.Default
    private EventState state = EventState.UPCOMING;

    @Column(nullable = false)
    private boolean isDeleted = false; //논리적 삭제 플래그

    public void markAsDeleted() {
        this.isDeleted = true;
    }
    //UPCOMING -> ONGOING
    public void changeStateToOngoing() {
        this.state = EventState.ONGOING;
    }
    //ONGOING -> END
    public void changeStateToEnd() {
        this.state = EventState.END;
    }

    public void update(UpdateEventReq updateEventReq) {
        this.couponName = updateEventReq.getCouponName();
        this.eventEndDate = updateEventReq.getEventEndDate();
    }
}
