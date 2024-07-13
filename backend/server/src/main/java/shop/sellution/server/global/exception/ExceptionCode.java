package shop.sellution.server.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionCode {


    INVALID_REQUEST(1000, "올바르지 않은 요청입니다."),
    INVALID_INPUT_VALUE(1001, "유효하지 않는 요청값입니다."),

    DUPLICATED_CONTRACT_COMPANY_BUSINESS_REGISTRATION_NUMBER(6001, "이미 등록된 사업자 등록 번호입니다."),
    DUPLICATED_CONTRACT_COMPANY_CONTRACT_AUTH_ID(6002, "이미 사용 중인 계약 사업체 인증 아이디입니다."),
    NOT_FOUNT_CONTRACT_AUTH_ID(6003, "요청한 ID에 해당하는 사업체를 찾을 수 없습니다."),

    DUPLICATED_USERNAME(6004, "이미 사용 중인 사용자명입니다."),
    DUPLICATED_PHONE_NUMBER(6005, "이미 등록된 전화번호입니다."),
    NOT_FOUND_COMPANY_ID(6006, "해당 회사를 찾을 수 없습니다."),

    // auth
    INVALID_USERNAME_FORMAT(7001, "유효하지 않은 로그인 형식입니다."),
    INVALID_USER_ROLE(7002, "유효하지 않은 권한입니다."),
    INVALID_COMPANY_ID_FORMAT(7003, "유효하지 않은 사업체 ID 형식입니다."),
    NOT_FOUND_CLIENT(7004, "요청한 ID에 해당하는 고객을 찾을 수 없습니다."),
//    NOT_FOUND_CUSTOMER(7005, "요청한 ID에 해당하는 회원을 찾을 수 없습니다."),

    //JWT
    EXPIRED_JWT_TOKEN(4000, "토큰이 만료되었습니다."),
    UNSUPPORTED_JWT_TOKEN(4001, "지원하지 않는 JWT 형식입니다."),
    INVALID_JWT_TOKEN(4002, "JWT 구조가 유효하지 않습니다."),
    INVALID_JWT_SIGNATURE(4003, "JWT 서명이 유효하지 않습니다."),
    EMPTY_JWT_CLAIMS(4004, "JWT claims 문자열이 비었습니다."),
    NULL_REFRESH_TOKEN(4005, "Refresh Token이 존재하지 않습니다."),

    //SMS
    BLOCKED_SMS_AUTH(4006, "SMS 인증 대기 시간입니다."),
    EXCEEDED_REQUEST_LIMIT(4007, "제한된 요청 횟수를 초과하였습니다."),
    INVALID_SMS_AUTH(4008, "유효하지 않은 인증번호 입니다."),

    // ---------------------------- Account 5001 ~ 5500 ---------------------------------------
    NOT_FOUND_CUSTOMER(5001,"요청한 ID에 해당하는 회원을 찾을 수 없습니다."),
    INVALID_ACCOUNT_INFO(5002,"유효하지않은 계좌정보입니다."),
    NOT_FOUND_ACCOUNT(5001,"요청한 ID에 해당하는 계좌를 찾을 수 없습니다."),





    // ---------------------------- Client,Customer 8001 ~ 8999 ---------------------------------------

    INVALID_USER_NAME(8001, "존재하지 않는 사용자입니다."),
    INVALID_PASSWORD(8002, "비밀번호가 일치하지 않습니다."),
    NULL_ADMIN_AUTHORITY(8101, "잘못된 관리자 권한입니다."),
    DUPLICATED_ADMIN_USERNAME(8102, "중복된 사용자 이름입니다."),
    NOT_FOUND_ADMIN_ID(8103, "요청한 ID에 해당하는 관리자를 찾을 수 없습니다."),
    INVALID_CURRENT_PASSWORD(8104, "현재 사용중인 비밀번호가 일치하지 않습니다."),
    INVALID_ADMIN_AUTHORITY(8201, "해당 관리자 기능에 대한 접근 권한이 없습니다."),

    //  ---------------------------- Auth 9001 ~ 9998 ---------------------------------------

    INVALID_AUTHORIZATION_CODE(9001, "유효하지 않은 인증 코드입니다."),
    NOT_SUPPORTED_OAUTH_SERVICE(9002, "해당 OAuth 서비스는 제공하지 않습니다."),
    FAIL_TO_CONVERT_URL_PARAMETER(9003, "Url Parameter 변환 중 오류가 발생했습니다."),
    INVALID_REFRESH_TOKEN(9101, "올바르지 않은 형식의 RefreshToken입니다."),
    INVALID_ACCESS_TOKEN(9102, "올바르지 않은 형식의 AccessToken입니다."),
    EXPIRED_PERIOD_REFRESH_TOKEN(9103, "기한이 만료된 RefreshToken입니다."),
    EXPIRED_PERIOD_ACCESS_TOKEN(9104, "기한이 만료된 AccessToken입니다."),
    FAIL_TO_VALIDATE_TOKEN(9105, "토큰 유효성 검사 중 오류가 발생했습니다."),
    NOT_FOUND_REFRESH_TOKEN(9106, "refresh-token에 해당하는 쿠키 정보가 없습니다."),
    INVALID_AUTHORITY(9201, "해당 요청에 대한 접근 권한이 없습니다."),

    // ------------------------------------------------------------------------------


    EXTERNAL_SEVER_ERROR(9998, "외부 서버 에러가 발생하였습니다. 관리자에게 문의해 주세요."),
    INTERNAL_SEVER_ERROR(9999, "서버 에러가 발생하였습니다. 관리자에게 문의해 주세요.");

    private final int code;
    private final String message;
}
