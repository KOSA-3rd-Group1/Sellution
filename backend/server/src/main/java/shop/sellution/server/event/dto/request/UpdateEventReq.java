package shop.sellution.server.event.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UpdateEventReq {
    @NotBlank(message = "쿠폰 이름은 필수입니다.") //빈문자열도 허락되지 않는다
    private String couponName;
    @NotNull(message = "이벤트 종료기간은 필수입니다.")
    private LocalDate eventEndDate; //연장만 가능하게
}
