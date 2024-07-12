package shop.sellution.server.auth.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import shop.sellution.server.global.util.JWTUtil;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;
    private final JWTUtil jwtUtil;

    private static final String KET_PREFIX = "refresh_token:";

    @Override
    public void saveRefreshToken(Long userId, Long companyId, String userRole, String refreshToken) {
        String key = generateKey(userId, companyId, userRole);
        redisTemplate.opsForValue().set(key, refreshToken, jwtUtil.REFRESH_TOKEN_EXPIRE, TimeUnit.MILLISECONDS);
    }

    @Override
    public String getRefreshToken(Long userId, Long companyId, String userRole) {
        String key = generateKey(userId, companyId, userRole);
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteRefreshToken(Long userId, Long companyId, String userRole) {
        String key = generateKey(userId, companyId, userRole);
        redisTemplate.delete(key);
    }

    @Override
    public boolean validateRefreshToken(Long userId, Long companyId, String userRole, String refreshToken) {
        String storedToken = getRefreshToken(userId, companyId, userRole);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    @Override
    public String generateKey(Long userId, Long companyId, String userRole) {
        return KET_PREFIX + userRole + ":" + companyId + ":" + userId;
    }
}
