package shop.sellution.server.sms.application;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface SmsService {

    //메세지 발송
    ResponseEntity<Map<String, String>> sendSms(String to, String sendMessage);
}
