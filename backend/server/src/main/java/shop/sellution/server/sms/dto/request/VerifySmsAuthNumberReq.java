package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public class VerifySmsAuthNumberReq extends BaseSmsAuthNumberReq {

    private String authNumber;

//    protected VerifySmsAuthNumberReq(String authType, String role, Long companyId, Long userId) {
//        super(authType, role, companyId, userId);
//    }

    public VerifySmsAuthNumberReq(String authType, String role, Long companyId, Long userId, String authNumber) {
        super(authType, role, companyId, userId);

        this.authNumber = authNumber;
    }
}
