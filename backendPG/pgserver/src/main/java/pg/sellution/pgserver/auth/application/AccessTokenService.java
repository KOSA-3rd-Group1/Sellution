package pg.sellution.pgserver.auth.application;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pg.sellution.pgserver.auth.domain.Client;
import pg.sellution.pgserver.auth.domain.ClientRepository;
import pg.sellution.pgserver.auth.util.AccessToken;
import pg.sellution.pgserver.global.exception.AuthException;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.UUID;
import java.util.regex.Pattern;

import static pg.sellution.pgserver.global.exception.ExceptionCode.*;

@Service
@Slf4j
public class AccessTokenService {

    private final ClientRepository clientRepository;
    private final RedisTemplate<String, AccessToken> redisTemplate;
    private final SecretKey jwtSecretKey;
    private final Duration jwtExpiration;

    private static final String TOKEN_PREFIX = "token:";

    public AccessTokenService(
            RedisTemplate<String, AccessToken> redisTemplate,
            @Value("${spring.jwt.expiration}") Duration jwtExpiration,
            @Value("${spring.jwt.secret}") String jwtSecret,
            ClientRepository clientRepository
    ) {
        this.redisTemplate = redisTemplate;
        this.jwtExpiration = jwtExpiration;
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.clientRepository = clientRepository;
    }

    @Transactional
    public String generateToken(String name,String apiKey, String permission, Integer price, String ip) {

        Client client = clientRepository.findByName(name);
        if (client == null || !client.getApiKey().equals(apiKey)) {
            throw new AuthException(INVALID_API_KEY);
        }

        String tokenId = UUID.randomUUID().toString();
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(now.getTime() + jwtExpiration.toMillis());

        log.info("토큰 생성 시작 - tokenId: {}, name: {}, permission: {}, price: {}, ip: {}, now: {},expiryDate: {}", tokenId, name, permission, price, ip, now, expiryDate);

        // JWT 토큰 생성
        String jwt = Jwts.builder()
                .subject(tokenId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(jwtSecretKey)
                .compact();

        // Redis에 토큰 정보 저장
        AccessToken accessToken = AccessToken.builder()
                .clientName(name)
                .permission(permission)
                .price(price)
                .issuedIp(ip)
                .build();

        String redisKey = TOKEN_PREFIX + tokenId;
        redisTemplate.opsForValue().set(redisKey, accessToken, jwtExpiration);
        log.info("토큰 생성 완료 - jwt : {} , accessToken : {}, redisKey : {}", jwt, accessToken, redisKey);
        return jwt;
    }


    public void validateToken(String jwt, String permission, Integer price, String ip) {

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(jwtSecretKey)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();

            // 만료 시간 검증
            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                throw new AuthException(EXPIRED_TOKEN);
            }

            String tokenId = claims.getSubject();
            String redisKey = TOKEN_PREFIX + tokenId;
            AccessToken accessToken = redisTemplate.opsForValue().get(redisKey);

            log.info(" 토큰 검증 - jwt : {} , redisKey : {}, accessToken : {}, ", jwt, redisKey, accessToken);
            if (accessToken == null) {
                throw new AuthException(NOT_FOUND_REDIS_ACCESS_TOKEN);
            }
            validateTokenDetails(accessToken, permission, price, ip);

        } catch (SignatureException e) {
            throw new AuthException(INVALID_TOKEN_SIGNATURE);
        } catch (MalformedJwtException e) {
            throw new AuthException(INVALID_TOKEN_FORMAT);
        } catch (ExpiredJwtException e) {
            throw new AuthException(EXPIRED_TOKEN);
        }
    }

    public void invalidateToken(String jwt) {
        Claims claims = Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();

        String tokenId = claims.getSubject();
        String redisKey = TOKEN_PREFIX + tokenId;
        redisTemplate.delete(redisKey);
        log.info(" 토큰 삭제 - jwt : {}",jwt);

    }

    private void validateTokenDetails(AccessToken accessToken, String permission, Integer price, String ip) {
        if (!accessToken.getPermission().equals(permission) || !accessToken.getPrice().equals(price)) {
            throw new AuthException(INVALID_DATA_WITH_TOKEN);
        }
        validateIpAddress(accessToken.getIssuedIp(), ip);
    }

    private void validateIpAddress(String storedIp, String currentIp) {
        log.info("ip 검사 - storedIP {} , currentIP {}", storedIp, currentIp);
        String[] storedParts = splitIpAddress(storedIp);
        String[] currentParts = splitIpAddress(currentIp);


        if (storedParts.length != currentParts.length) {
            throw new AuthException(INVALID_IP);
        }

        // 처음 3개의 ip만 비교
        for (int i = 0; i < 3; i++) {
            if (!storedParts[i].equals(currentParts[i])) {
                throw new AuthException(INVALID_IP);
            }
        }

    }

    private String[] splitIpAddress(String ip) {
        if (isIPv4(ip)) {
            return ip.split("\\.");
        } else if (isIPv6(ip)) {
            return ip.split(":");
        } else {
            throw new AuthException(INVALID_IP_FORMAT);
        }
    }

    private boolean isIPv4(String ip) {
        return Pattern.matches("^(\\d{1,3}\\.){3}\\d{1,3}$", ip);
    }

    private boolean isIPv6(String ip) {
        return Pattern.matches("^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", ip);
    }

}