package shop.sellution.server.sms.dto.request;

import lombok.Getter;

@Getter
public abstract class BaseSmsAuthNumberReq {

    private String role;
    private Long companyId;
    private Long userId;

    //생성자
    protected BaseSmsAuthNumberReq(String role, Long companyId, Long userId) {
        this.role = role;
        this.companyId = companyId;
        this.userId = userId;
    }
}
