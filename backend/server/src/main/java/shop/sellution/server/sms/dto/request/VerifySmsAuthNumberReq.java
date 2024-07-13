package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public class VerifySmsAuthNumberReq extends BaseSmsAuthNumberReq {

    private String authNumber;

    protected VerifySmsAuthNumberReq(String role, Long companyId, Long userId) {
        super(role, companyId, userId);
    }

    public VerifySmsAuthNumberReq(String role, Long companyId, Long userId, String authNumber) {
        super(role, companyId, userId);
        this.authNumber = authNumber;
    }
}
