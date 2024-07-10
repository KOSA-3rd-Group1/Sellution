package shop.sellution.server.global.exception;

import lombok.Getter;

@Getter
public class ExternalApiException extends RuntimeException {

    private final int code;
    private final String message;

    public ExternalApiException(final ExceptionCode exceptionCode) {
        this.code = exceptionCode.getCode();
        this.message = exceptionCode.getMessage();
    }
}
