package shop.sellution.server.auth.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import shop.sellution.server.auth.application.RefreshTokenService;
import shop.sellution.server.global.exception.AuthException;
import shop.sellution.server.global.util.JWTUtil;

import java.io.IOException;

import static shop.sellution.server.global.exception.ExceptionCode.INVALID_REFRESH_TOKEN;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_REFRESH_TOKEN;

@RequiredArgsConstructor
public class CustomLogoutFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (!isLogoutRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String refreshToken = extractRefreshToken(request);
            validateAndProcessLogout(refreshToken, response);
            clearSecurityContext();

            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            handleLogoutFailure(response, e);
        }
    }

    private boolean isLogoutRequest(HttpServletRequest request) {
        return request.getRequestURI().equals("/logout") && "POST".equalsIgnoreCase(request.getMethod());
    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        throw new AuthException(NOT_FOUND_REFRESH_TOKEN);
    }

    // refresh token 유효성 검증 및 refresh 토큰 제거
    private void validateAndProcessLogout(String refreshToken, HttpServletResponse response) {

        Claims claims = jwtUtil.validateToken(refreshToken); // 토큰 검증

        String category = jwtUtil.getCategory(refreshToken);
        String userRole = jwtUtil.getRoles(refreshToken).get(0);
        Long userId = jwtUtil.getUserId(refreshToken);
        Long companyId = jwtUtil.getCompanyId(refreshToken);

        // 토큰이 refresh 토큰인지 catogory 확인
        if (!"refresh".equals(category)) {
            throw new AuthException(INVALID_REFRESH_TOKEN);
        }

        // refresh 토큰이 redis에 저장되어있는지 확인
        String storedToken = refreshTokenService.getRefreshToken(userId, companyId, userRole);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new AuthException(NOT_FOUND_REFRESH_TOKEN);
        }

        // refresh token을 redis에서 제거
        refreshTokenService.deleteRefreshToken(userId, companyId, userRole);

        // Cookie에서 refresh token 제거
        removeRefreshTokenCookie(response);
    }

    // cookie에서 토큰 제거
    private void removeRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    // securityContextHolder 비우기
    private void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private void handleLogoutFailure(HttpServletResponse response, Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }
}
