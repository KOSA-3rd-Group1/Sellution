package shop.sellution.server.event.dto.response;

import lombok.*;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.type.EventState;
import shop.sellution.server.event.domain.type.TargetCustomerType;

import java.time.LocalDate;

@Getter
@Builder
public class FindEventRes { //회원의 이벤트 목록 조회
    private Long id;
    private String couponName;
    private Integer couponDiscountRate;
    private TargetCustomerType targetCustomerType;
    private LocalDate eventStartDate;
    private LocalDate eventEndDate;
    private EventState state;

    public static FindEventRes fromEntity(CouponEvent couponEvent) {
        return FindEventRes.builder()
                .id(couponEvent.getId())
                .couponName(couponEvent.getCouponName())
                .couponDiscountRate(couponEvent.getCouponDiscountRate())
                .targetCustomerType(couponEvent.getTargetCustomerType())
                .eventStartDate(couponEvent.getEventStartDate())
                .eventEndDate(couponEvent.getEventEndDate())
                .state(couponEvent.getState())
                .build();
    }
}
