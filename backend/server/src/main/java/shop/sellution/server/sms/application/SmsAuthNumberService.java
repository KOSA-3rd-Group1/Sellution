package shop.sellution.server.sms.application;

import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;

public interface SmsAuthNumberService {
    
    //Sms 인증 번호 발송
    void sendSmsAuthNumber(SendSmsAuthNumberReq request);
}
