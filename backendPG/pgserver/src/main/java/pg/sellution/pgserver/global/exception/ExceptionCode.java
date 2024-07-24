package pg.sellution.pgserver.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionCode {


    INVALID_REQUEST(1000, "올바르지 않은 요청입니다."),
    INVALID_INPUT_VALUE(1001, "유효하지 않는 요청값입니다."),

    // AUTH
    NOT_FOUND_REDIS_ACCESS_TOKEN(4006, "redis에서 토큰을 찾을 수 없습니다."),
    INVALID_DATA_WITH_TOKEN(4007, "전달된 데이터와 토큰 내부 데이터가 맞지않습니다."),
    INVALID_IP_TYPE(4008, "유효하지 않은 IP 형식입니다."),
    INVALID_IP(4009, "유효하지 않은 IP입니다. 동일한 IP 에서만 접근 가능합니다."),
    EXPIRED_TOKEN(4010, "만료된 토큰입니다."),
    INVALID_TOKEN_SIGNATURE(4011, "유효하지 않은 토큰 서명입니다."),
    INVALID_TOKEN_FORMAT(4012, "유효하지 않은 토큰 형식입니다."),
    INVALID_API_KEY(4013, "유효하지 않은 API KEY입니다."),
    INVALID_AUTH_HEADER(4014, "유효하지 않은 헤더입니다."),
    INVALID_IP_FORMAT(4015,"유효하지않은 IP 포맷입니다." ),

    INVALID_ACCOUNT_INFO(5002,"유효하지않은 계좌정보입니다."),

    REDIS_ERROR(9997, "Redis 에러가 발생하였습니다. redis가 켜져있는지 확인하세요"),
    EXTERNAL_SEVER_ERROR(9998, "외부 서버 에러가 발생하였습니다. 관리자에게 문의해 주세요."),
    INTERNAL_SEVER_ERROR(9999, "서버 에러가 발생하였습니다. 관리자에게 문의해 주세요."),;

    private final int code;
    private final String message;
}
