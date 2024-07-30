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
    NOT_FOUND_USER(7006, "요청한 ID에 해당하는 사용자 찾을 수 없습니다."),

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
    INVALID_PASSWORD_RESET_TOKEN(4009, "유효하지 않은 요청입니다."),
    EXPIRED_PASSWORD_RESET_TOKEN(4010, "요청이 만료되었습니다."),
    SAME_OLD_PASSWORD(4011, "기존에 사용한 이력이 있는 비밀번호입니다."),

    // ---------------------------- Event 3000~3499 ---------------------------------------
    NOT_FOUND_EVENT(3000, "요청한 ID에 해당하는 이벤트를 찾을 수 없습니다."),
    INVALID_EVENT_SAVE_EVENTSTARTDATE(3001, "이벤트 시작일은 다음날부터 설정 가능합니다."),
    INVALID_EVENT_SAVE_EVENTENDDATE(3002, "이벤트 종료일 설정이 잘못되었습니다."),
    INVALID_EVENT_UPDATE_EVENTENDDATE(3003, "이벤트 종료일은 이전 종료일보다 늦어야 합니다."),
    INVALID_EVENT_UPDATE_ENDED_EVENT(3004, "종료된 이벤트는 수정할 수 없습니다."),
    INVALID_EVENT_DELETE_ONGOING_EVENT(3005, "진행중인 이벤트는 삭제할 수 없습니다."),
    COUPON_EXHAUSTED(3006, "쿠폰이 모두 소진되었습니다."),
    INVALID_DOWNLOAD_EVENT_DATE(3007, "이벤트 기간이 아닙니다"),
    INVALID_DOWNLOAD_EVENT_DELETED(3008, "중단된 이벤트는 쿠폰을 다운로드할 수 없습니다."),
    INVALID_DOWNLOAD_COUPON_ALREADY_DOWNLOADED(3009, "이미 쿠폰을 다운로드하셨습니다."),
    // ---------------------------- Account, Order, Pay , EasyPwd 5001 ~ 5500 ---------------------------------------

    NOT_FOUND_CUSTOMER(5001,"요청한 ID에 해당하는 회원을 찾을 수 없습니다."),
    INVALID_ACCOUNT_INFO(5002,"유효하지않은 계좌정보입니다."),
    NOT_FOUND_ACCOUNT(5001,"요청한 ID에 해당하는 계좌를 찾을 수 없습니다."),
    NOT_FOUND_ADDRESS(5002,"요청한 ID에 해당하는 주소를 찾을 수 없습니다."),
    NOT_FOUND_MONTH_OPTION(5003,"요청한 ID에 해당하는 월 옵션을 찾을 수 없습니다."),
    NOT_FOUND_WEEK_OPTION(5004,"요청한 ID에 해당하는 주 옵션을 찾을 수 없습니다."),
    NOT_FOUND_DAY_OPTION(5005,"요청한 ID에 해당하는 요일 옵션을 찾을 수 없습니다." ),
    INVALID_ORDER_TYPE(5006,"유효하지않은 주문 입력값입니다."),
    NOT_FOUND_PRODUCT(5007, "요청한 ID에 해당하는 상품을 찾을 수 없습니다."),
    NOT_FOUND_ORDER(5008, "요청한 ID에 해당하는 주문을 찾을 수 없습니다."),
    FAIL_TO_PAY(5009, "결제에 실패하였습니다."),
    FAIL_TO_GET_API_TOKEN(5010, "API 토큰반환을 실패하였습니다."),
    ALREADY_APPROVED_ORDER(5011,"이미 승인된 주문입니다."),
    ALREADY_CANCEL_ORDER(5012,"이미 취소된 주문입니다."),
    ALREADY_DELIVERED(5013,"이미 배송이 됬습니다." ),
    ALREADY_REGISTERED_EASY_PWD(5014,"이미 간편비밀번호가 등록 되어있습니다."),
    NOT_MATCH_ACCOUNT_ID(5015,"해당 주문에 사용되지않은 계좌입니다." ),
    NOT_ENOUGH_STOCK(5016,"재고가 부족합니다." ),
    FAIL_TO_PAY_CANCEL(5017,"결제취소에 실패하였습니다." ),
    INVALID_ORDER_INFO_FOR_ONETIME(5018,"단건 주문에 유효하지않은 정보값입니다." ),
    INVALID_ORDER_INFO_FOR_SUB(5018,"정기 주문에 유효하지않은 정보값입니다." ),
    ALREADY_ACCOUNT(5019,"이미 등록된 계좌입니다." ),



    // ---------------------------- Product, Address, category, event 6501 ~ 7000 ---------------------------------------

    NOT_FOUND_CUSTOMER_FOR_ADDRESS(6501, "주소와 연관된 회원을 찾을 수 없습니다."),
    FAILED_TO_RESET_DEFAULT_ADDRESS(6502, "기본 주소 재설정에 실패했습니다."),
    INVALID_ADDRESS_DATA(6503, "유효하지 않은 주소 데이터입니다."),
    CANNOT_DELETE_DEFAULT_ADDRESS(6504, "기본 배송지는 삭제할 수 없습니다."),

    NOT_FOUND_COMPANY(6601, "요청한 ID에 해당하는 회사를 찾을 수 없습니다."),
    FAIL_TO_GENERATE_QR_CODE(6602, "QR 코드 생성에 실패했습니다."),

    NOT_FOUND_CATEGORY(6701, "요청한 ID에 해당하는 카테고리를 찾을 수 없습니다."),

    FAIL_TO_UPLOAD_IMAGE(6801, "S3에 이미지 등록이 실패했습니다."),
    INVALID_IMAGE(6802, "유효하지 않는 이미지입니다."),
    FAIL_TO_RESIZE_IMAGE(6803, "이미지 리사이징 실패입니다."),
//    INVALID_LOGO_IMAGE_SIZE(6803, "로고 이미지는 정사각형이어야 합니다."),

    // ---------------------------- Client,Customer 8001 ~ 8999 ---------------------------------------

    INVALID_USER_NAME(8001, "존재하지 않는 사용자입니다."),
    INVALID_PASSWORD(8002, "비밀번호가 일치하지 않습니다."),
    NULL_ADMIN_AUTHORITY(8101, "잘못된 관리자 권한입니다."),
    DUPLICATED_ADMIN_USERNAME(8102, "중복된 사용자 이름입니다."),
    NOT_FOUND_ADMIN_ID(8103, "요청한 ID에 해당하는 관리자를 찾을 수 없습니다."),
    INVALID_CURRENT_PASSWORD(8104, "현재 사용중인 비밀번호가 일치하지 않습니다."),
    INVALID_ADMIN_AUTHORITY(8201, "해당 관리자 기능에 대한 접근 권한이 없습니다."),
    INVALID_CUSTOMER_INFO(8301, "회원의 이름과 전화번호 정보가 일치하지 않습니다"),

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
