package shop.sellution.server.auth.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.util.JWTUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            String accessToken = extractToken(request);

            if (accessToken != null) {

                Claims claims = jwtUtil.validateToken(accessToken);
                validateAccessToken(claims);

                CustomUserDetails customUserDetails = createCustomUserDetails(claims);

                //스프링 시큐리티 인증 토큰 생성
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        customUserDetails,
                        null,
                        customUserDetails.getAuthorities()
                );

                // 세션에 사용자 등록
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (AuthException e) {
            SecurityContextHolder.clearContext();
            throw e;
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            throw new AuthException(ExceptionCode.INVALID_ACCESS_TOKEN);
        }
        filterChain.doFilter(request, response);
    }

    //Authorization 헤더 검증 - access token 존재시 토큰 추출
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) return null;
        return bearerToken.substring(7);
    }

    //토큰이 access token 인지 확인
    private void validateAccessToken(Claims claims) {
        if (!"access".equals(claims.get("category"))) {
            throw new AuthException(ExceptionCode.INVALID_ACCESS_TOKEN);
        }
    }

    // User를 extends 한 AuthUserRes에 사용자 정보 담기
    private CustomUserDetails createCustomUserDetails(Claims claims) {
        Long userId = ((Number) claims.get("userId")).longValue();
        Long companyId = ((Number) claims.get("companyId")).longValue();
        String username = (String) claims.get("username");
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) claims.get("roles");
        return new CustomUserDetails(userId, companyId, username, "", roles);
    }
}
