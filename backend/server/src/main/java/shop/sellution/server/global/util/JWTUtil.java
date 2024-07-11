package shop.sellution.server.global.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.ExceptionCode;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class JWTUtil {

    private final SecretKey SECRET_KEY;
    public static final Long ACCESS_TOKEN_EXPIRE = 1000L; //30 * 60 * 1000L; // 30분
    public static final Long REFRESH_TOKEN_EXPIRE = 1000L; //14 * 24 * 60 * 60 * 1000L; // 14일

    public JWTUtil(@Value("${spring.jwt.secret}")String secret) {
        //JWT에서 더 이상 String key를 사용하지 않기 때문에 객체 키를 만들어서 사용
        this.SECRET_KEY = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    public String getUsername(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    public Long getUserId(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().get("userId", Long.class);
    }

    public Long getCompanyId(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().get("companyId", Long.class);
    }

    public List<String> getRoles(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload().get("roles", List.class);
    }

    public String generateToken(String category, Map<String, Object> valueMap) {
        long expiration = category.equals("access") ? ACCESS_TOKEN_EXPIRE : REFRESH_TOKEN_EXPIRE;
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claim("category", category)    //category를 통해 access인지 refresh인지 구분 - refresh토큰으로 access하는 것을 방지하기 위함
                .claims(valueMap)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(SECRET_KEY)
                .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)  //파싱 및 검증, 실패 시 에러
                    .getPayload();
        } catch (ExpiredJwtException e) {
            // throw new JwtException("Expired JWT token", e);
            throw new AuthException(ExceptionCode.EXPIRED_JWT_TOKEN);
        } catch (UnsupportedJwtException e) {
            // throw new JwtException("Unsupported JWT token", e);
            throw new AuthException(ExceptionCode.UNSUPPORTED_JWT_TOKEN);
        } catch (MalformedJwtException e) {
            // throw new JwtException("Invalid JWT token", e);
            throw new AuthException(ExceptionCode.INVALID_JWT_TOKEN);
        } catch (SignatureException e) {
            // throw new JwtException("Invalid JWT signature", e);
            throw new AuthException(ExceptionCode.INVALID_JWT_SIGNATURE);
        } catch (IllegalArgumentException e) {
            // throw new JwtException("JWT claims string is empty", e);
            throw new AuthException(ExceptionCode.EMPTY_JWT_CLAIMS);
        }
    }
}
