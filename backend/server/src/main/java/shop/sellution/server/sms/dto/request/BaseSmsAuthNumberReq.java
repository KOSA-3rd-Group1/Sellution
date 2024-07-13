package shop.sellution.server.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import shop.sellution.server.global.annotation.validation.ValidPhoneNumber;

@Getter
public abstract class BaseSmsAuthNumberReq {

    @NotBlank
    private String name;

    @NotBlank
    @ValidPhoneNumber
    private String phoneNumber;

    //생성자
    protected BaseSmsAuthNumberReq(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}
