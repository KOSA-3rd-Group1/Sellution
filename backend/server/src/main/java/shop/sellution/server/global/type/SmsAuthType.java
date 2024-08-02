package shop.sellution.server.global.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SmsAuthType {
    ID("id"),   // 아이디 찾기
    PASSWORD("pw"), // 비밀번호 찾기
    AUTHENTICATION("auth"), // 본인 인증
    SECONDARY_LOGIN("Login2"), // 2차 로그인 인증
    SIGNUP("signup");

    private final String name;
}
