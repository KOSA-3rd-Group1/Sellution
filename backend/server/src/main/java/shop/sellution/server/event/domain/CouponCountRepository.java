package shop.sellution.server.event.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.ReturnType;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Repository;

import java.util.Collections;

@Getter
@RequiredArgsConstructor
@Repository
public class CouponCountRepository {
    // redisTemplate에 접근할 수 있는 메서드 추가
    private final RedisTemplate<String, String> redisTemplate;

    //이벤트별 쿠폰 개수를 초기화하는 메서드
    public void setInitialQuantity(Long eventId, int quantity){
        redisTemplate.opsForValue().set("couponCount:"+eventId, String.valueOf(quantity));
    }
    //mysql의 쿠폰 개수 가져오는 로직 >> couponCountRepository의 decrement메소드로 대체
    //이벤트별 쿠폰 개수를 감소시키는 메서드 (Lua 스크립트)
    //decr만 사용하게 되면 서비스단에서 남은 쿠폰 개수를 확인하고 에러를 던지는 시점에 이미 중복된 쿠폰이 발급되어 있을 수 있다
    //동시 요청 >> decr이루어지고 난 후
    public Long decrement(Long eventId) {
        String script = "local qty = tonumber(redis.call('get', KEYS[1])) " +
                "if qty > 0 then " +
                "  redis.call('decr', KEYS[1]) " +
                "  return qty - 1 " +
                "else " +
                "  return -1 " +
                "end";
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptText(script);
        redisScript.setResultType(Long.class);
        return redisTemplate.execute(
            redisScript,
                Collections.singletonList("couponCount:" + eventId)
        );
    }

}
