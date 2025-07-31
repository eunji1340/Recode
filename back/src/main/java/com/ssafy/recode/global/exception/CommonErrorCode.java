package com.ssafy.recode.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CommonErrorCode implements ErrorCode {
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "001", "잘못된 입력값입니다."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "002", "잘못된 타입입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "500", "내부 서버 오류가 발생했습니다."),
    USER_NOT_FOUND(HttpStatus.FORBIDDEN, "403", "존재하지 않은 사용자입니다."),
    APPLY_NOT_FOUND(HttpStatus.NOT_FOUND, "405", "해당 신청 내역이 존재하지 않습니다."),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "401", "Refresh token이 만료되었습니다.");

    private static final String PREFIX = "COMMON";
    private final HttpStatus status;
    private final String code;
    private final String message;

    @Override
    public String getFullCode() {
        return PREFIX + "_" + code;
    }
}
