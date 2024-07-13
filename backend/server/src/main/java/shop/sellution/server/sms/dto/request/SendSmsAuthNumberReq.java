package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public class SendSmsAuthNumberReq {

    private String role;
    private Long companyId;
    private Long userId;
    private String phoneNumber;
}
