package shop.sellution.server.sms.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.sms.dto.RedisSmsAuthNumberValue;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;

import java.security.SecureRandom;
import java.time.Duration;

import static shop.sellution.server.global.exception.ExceptionCode.BLOCKED_SMS_AUTH;
import static shop.sellution.server.global.exception.ExceptionCode.EXCEEDED_REQUEST_LIMIT;

@Service
@RequiredArgsConstructor
public class SmsAuthNumberServiceImpl implements SmsAuthNumberService {

    private final RedisTemplate<String, String> redisTemplate;
    private final SmsService smsService;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int AUTH_NUMBER_EXPIRATION_MINUTES = 5;
    private static final int MAX_REQUESTS = 3;
    private static final int REQUEST_BLOCK_MINUTES = 5;

    @Override
    public void sendSmsAuthNumber(SendSmsAuthNumberReq request) {

        // 받은 request를 통해 redis key 생성 - sms_auth_number:{role}:{company_id}:{id}
        String key = getRedisKey(request);
        RedisSmsAuthNumberValue value = getRedisSmsAuthNumberValue(key);

        // redis에 저장된 값의 block 여부
        if (value.isBlocked()) {
            throw new AuthException(BLOCKED_SMS_AUTH);  // 인증 대기 시간
        }

        // count가 3이상이면 block으로 변경, redis 만료 시간 설정, 에러 처리
        value.recordNewAttempt();
        if (value.getAttemptCount() > MAX_REQUESTS) {
            value.markAsBlocked();
            saveRedisSmsAuthNumber(key, value, REQUEST_BLOCK_MINUTES);
            throw new AuthException(EXCEEDED_REQUEST_LIMIT); // 요청 제한 횟수 초과
        }

        // 새 인증번호 생성
        String newAuthNumber = generateAuthNumber();
        value.updateAuthNumber(newAuthNumber);

        // redis에 저장
        saveRedisSmsAuthNumber(key, value, AUTH_NUMBER_EXPIRATION_MINUTES);

        // 인증번호 발송 요청
        String sendMessage = String.format("[Sellution] 인증번호 [%s]을 입력해주세요", newAuthNumber);

        /**
         * 문자 한도 제한으로 인해 주석 처리 해두었습니다.
         * 실제 테스트 시에는 주석 제거하고 사용하고, 테스트가 끝나면 다시 주석처리 해주시길 바랍니다.
         */
         //smsService.sendSms(request.getPhoneNumber(), sendMessage);
    }

    private String getRedisKey(SendSmsAuthNumberReq request) {
        return "sms_auth_number:" +
                request.getRole() + ":" +
                request.getCompanyId() + ":" +
                request.getUserId();
    }

    private RedisSmsAuthNumberValue getRedisSmsAuthNumberValue(String key) {
        String value = redisTemplate.opsForValue().get(key);
        if (value == null) return new RedisSmsAuthNumberValue();
        return RedisSmsAuthNumberValue.fromString(value);
    }

    private String generateAuthNumber() {
        int authNumber = 100000 + secureRandom.nextInt(900000); // 100000 ~ 999999
        return String.valueOf(authNumber);
    }

    private void saveRedisSmsAuthNumber(String key, RedisSmsAuthNumberValue value, long expirationMinutes) {
        redisTemplate.opsForValue().set(key, value.toString(), Duration.ofMinutes(expirationMinutes));
    }
}
