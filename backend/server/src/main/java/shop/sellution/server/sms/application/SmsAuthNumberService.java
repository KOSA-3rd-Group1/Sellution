package shop.sellution.server.sms.application;

import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

public interface SmsAuthNumberService {
    
    //Sms 인증 번호 발송
    void sendSmsAuthNumber(SendSmsAuthNumberReq request);

    //Sms 인증 번호 검증
    void verifySmsAuthNumber(VerifySmsAuthNumberReq request);
}
