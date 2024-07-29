package shop.sellution.server.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCustomerReq {

    @NotBlank(message = "회원명 입력은 필수입니다.")
    private String customerName;

    @NotBlank(message = "전화번호 입력은 필수입니다.")
    @ValidPhoneNumber
    private String phoneNumber;
}
