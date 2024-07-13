package shop.sellution.server.sms.application;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import shop.sellution.server.sms.provider.SmsProvider;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    private final SmsProvider smsProvider;

    @Override
    public ResponseEntity<Map<String, String>> sendSms(String to, String sendMessage) {

        try {
            boolean result = smsProvider.sendSms(to, sendMessage);
            if (!result) ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","메세지 전송이 실패했습니다."));

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "메세지 전송 중 예외가 발생했습니다."));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", "메세지 전송에 성공했습니다."));

    }
}
