package com.ssafy.recode.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BaseException extends RuntimeException{
    private final HttpStatus status;
    private final String code;
    private final String message;

    private BaseException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
        this.message = message;
    }

    protected BaseException(ErrorCode errorCode) {
        this(
                errorCode.getStatus(),
                errorCode.getFullCode(),
                errorCode.getMessage()
        );
    }

    public static BaseException of(ErrorCode errorCode) {
        return new BaseException(errorCode);
    }

}
