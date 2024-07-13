package shop.sellution.server.sms.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.sms.dto.RedisSmsAuthNumberValue;
import shop.sellution.server.sms.dto.request.BaseSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.SendSmsAuthNumberReq;
import shop.sellution.server.sms.dto.request.VerifySmsAuthNumberReq;

import java.security.SecureRandom;
import java.time.Duration;

import static shop.sellution.server.global.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class SmsAuthNumberServiceImpl implements SmsAuthNumberService {

    private final RedisTemplate<String, String> redisTemplate;
    private final SmsService smsService;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int AUTH_NUMBER_EXPIRATION_MINUTES = 5;
    private static final int MAX_REQUESTS = 3;
    private static final int REQUEST_BLOCK_MINUTES = 5;
    private static final String REDIS_KEY_FORMAT_SMS_AUTH_NUMBER = "sms_auth_number:%s:%s:%d:%d";


    @Override
    public void sendSmsAuthNumber(SendSmsAuthNumberReq request) {

        // 받은 request를 통해 redis key 생성 - sms_auth_number:{authType}:{role}:{companyId}:{userId}
        String key = getRedisKey(request);
        RedisSmsAuthNumberValue value = getRedisSmsAuthNumberValue(key, "send");

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
//         smsService.sendSms(request.getPhoneNumber(), sendMessage);
    }

    @Override
    public void verifySmsAuthNumber(VerifySmsAuthNumberReq request) {
        // 받은 request를 통해 redis key 생성 - sms_auth_number:{authType}:{role}:{companyId}:{userId}
        String key = getRedisKey(request);
        System.out.println(key);

        // 생성한 Redis key를 통해 value 값 가져오기 - 여기 에러 처리 필요
        RedisSmsAuthNumberValue value = getRedisSmsAuthNumberValue(key, "verify");

        if (value.isBlocked()) {
            throw new AuthException(BLOCKED_SMS_AUTH);  // 인증 대기 시간
        }

        if (!value.getAuthNumber().equals(request.getAuthNumber())) {
            throw new AuthException(INVALID_SMS_AUTH);
        };

        // 인증번호가 유효한 경우 redis에 저장된 정보 제거
        redisTemplate.delete(key);
    }

    private String getRedisKey(BaseSmsAuthNumberReq request) {
        return String.format(REDIS_KEY_FORMAT_SMS_AUTH_NUMBER, request.getAuthType(), request.getRole(), request.getCompanyId(), request.getUserId());
    }

    private RedisSmsAuthNumberValue getRedisSmsAuthNumberValue(String key, String type) {
        String value = redisTemplate.opsForValue().get(key);
        if (type.equals("send") && value == null) {
            return new RedisSmsAuthNumberValue();
        } else if (type.equals("verify") && value == null) {
            throw new AuthException(INVALID_SMS_AUTH);
        }
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
