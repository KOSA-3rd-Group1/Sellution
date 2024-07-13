package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public class SendSmsAuthNumberReq extends BaseSmsAuthNumberReq{

    private String phoneNumber;

    protected SendSmsAuthNumberReq(String authType, String role, Long companyId, Long userId) {
        super(authType, role, companyId, userId);
    }
}
