package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public abstract class BaseSmsAuthNumberReq {

    private String authType; //인증 유형
    private String role;
    private Long companyId;
    private Long userId;

    //생성자
    protected BaseSmsAuthNumberReq(String authType, String role, Long companyId, Long userId) {
        this.authType = authType;
        this.role = role;
        this.companyId = companyId;
        this.userId = userId;
    }
}
