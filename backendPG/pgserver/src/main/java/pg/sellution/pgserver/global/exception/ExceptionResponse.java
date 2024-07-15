package pg.sellution.pgserver.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ExceptionResponse {

    private final int code;
    private final String message;
}