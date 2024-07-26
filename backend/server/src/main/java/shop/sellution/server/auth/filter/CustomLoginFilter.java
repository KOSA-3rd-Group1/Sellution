package shop.sellution.server.auth.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import shop.sellution.server.auth.application.RefreshTokenService;
import shop.sellution.server.auth.dto.CustomUserDetails;
import shop.sellution.server.global.util.CookieUtil;
import shop.sellution.server.global.util.JWTUtil;

import java.io.IOException;
import java.util.Map;

public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public CustomLoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;

        setFilterProcessesUrl("/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 사용자 요청에서 username, password, role, companyId 추출
        String companyId = request.getParameter("companyId") == null ? "0" : request.getParameter("companyId");
        String username = request.getParameter("role") + ":" + obtainUsername(request) + ":" + companyId;
        String password = obtainPassword(request);

        // 스프링 시큐리티에서 username, password를 검증하기 위해 token에 담는다.'
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);

        // token의 유효성 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    // 로그인 성공 시 실행하는 메소드
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authResult.getPrincipal();
        Map<String, Object> claims = customUserDetails.getClaims();

        System.out.println(claims.toString());

        //로그인 성공 시 JWT 토큰 생성
        String accessToken = jwtUtil.generateToken("access", claims);
        String refreshToken = jwtUtil.generateToken("refresh", claims);

        // redis에 저장
         refreshTokenService.saveRefreshToken(
                 jwtUtil.getUserId(refreshToken),
                 jwtUtil.getCompanyId(refreshToken),
                 jwtUtil.getRoles(refreshToken).get(0),
                 refreshToken
         );

        /**
         * HTTP 인증 방식 - RFC 7235 정의에 따라 사용
         */
        response.addHeader("Authorization", "Bearer " + accessToken); // accessTokne은 header에 담아서 저장
        CookieUtil.addCookie(response, "refresh", refreshToken, (int) (JWTUtil.REFRESH_TOKEN_EXPIRE / 1000)); // refreshToken는 쿠키에 저장

        response.setStatus(HttpStatus.OK.value());
    }

    // 로그인 실패 시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(401);
//        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, failed.getMessage());
    }
}
