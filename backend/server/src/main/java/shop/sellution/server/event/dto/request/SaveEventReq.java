package shop.sellution.server.event.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.event.domain.CouponEvent;
import shop.sellution.server.event.domain.type.TargetCustomerType;

import java.time.LocalDate;

@Builder
@Getter
public class SaveEventReq {
    @NotBlank(message = "쿠폰 이름은 필수입니다.")
    private String couponName;

    @NotNull(message = "쿠폰 할인율은 필수입니다.")
    @Digits(integer = 2, fraction = 0, message = "쿠폰 할인율은 2자리 이하의 정수여야 합니다.")
    @Min(value = 1, message = "쿠폰 할인율은 1 이상이어야 합니다.")
    @Max(value = 99, message = "쿠폰 할인율은 99 이하이어야 합니다.")
    private Integer couponDiscountRate;

    @NotNull(message = "대상 고객 유형은 필수입니다.")
    private TargetCustomerType targetCustomerType;

    @NotNull(message = "이벤트 시작일은 필수입니다.")
    private LocalDate eventStartDate;

    @NotNull(message = "이벤트 종료일은 필수입니다.")
    private LocalDate eventEndDate;

    @NotNull(message = "이벤트 수량은 필수입니다.")
    private Integer totalQuantity;

    public CouponEvent toEntity(Company company) {
        return CouponEvent.builder()
                .company(company)
                .couponName(couponName)
                .couponDiscountRate(couponDiscountRate)
                .targetCustomerType(targetCustomerType)
                .eventStartDate(eventStartDate)
                .eventEndDate(eventEndDate)
                .totalQuantity(totalQuantity)
                .build();
    }

}
