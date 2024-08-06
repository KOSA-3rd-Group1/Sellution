package shop.sellution.server.event.domain;

import lombok.*;
import jakarta.persistence.*;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;
import shop.sellution.server.event.dto.request.UpdateEventReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
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

    //수량 제한 (무제한 삭제)
    @Column(nullable = false)
    private Integer totalQuantity;

//    @Column(nullable = false)
//    private Integer remainingQuantity;

    @Enumerated(EnumType.STRING) //스케줄러로 업데이트
    @Column(nullable = false, columnDefinition = "ENUM('UPCOMING','ONGOING','END')")
    private EventState state;

    @Column(nullable = false)
    private boolean isDeleted = false; //논리적 삭제 플래그

//    @Builder
//    public CouponEvent(Company company, String couponName, Integer couponDiscountRate, TargetCustomerType targetCustomerType, LocalDate eventStartDate, LocalDate eventEndDate, Integer totalQuantity) {
//        this.company = company;
//        this.couponName = couponName;
//        this.couponDiscountRate = couponDiscountRate;
//        this.targetCustomerType = targetCustomerType;
//        this.eventStartDate = eventStartDate;
//        this.eventEndDate = eventEndDate;
//        this.totalQuantity = totalQuantity;
//        this.isDeleted = false;
//        this.state = determineInitialState(eventStartDate);
//    }

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

    //Remaining quantity 감소 메서드 >> save 전에 확인
//    public void decreaseRemainingQuantity() {
//        this.remainingQuantity--;
//    }
}
