package com.ssafy.record.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Authentication & Authorization (1xxx)
    UNAUTHORIZED("1001", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN("1002", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN("1003", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("1004", HttpStatus.FORBIDDEN),

    // User (2xxx)
    USER_NOT_FOUND("2001", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("2002", HttpStatus.CONFLICT),
    INVALID_PASSWORD("2003", HttpStatus.BAD_REQUEST),

    // Meeting (3xxx)
    MEETING_NOT_FOUND("3001", HttpStatus.NOT_FOUND),
    MEETING_ALREADY_STARTED("3002", HttpStatus.CONFLICT),
    MEETING_NOT_STARTED("3003", HttpStatus.BAD_REQUEST),
    MEETING_ALREADY_ENDED("3004", HttpStatus.CONFLICT),

    // Project (4xxx)
    PROJECT_NOT_FOUND("4001", HttpStatus.NOT_FOUND),
    PROJECT_ACCESS_DENIED("4002", HttpStatus.FORBIDDEN),

    // File & S3 (5xxx)
    FILE_NOT_FOUND("5001", HttpStatus.NOT_FOUND),
    FILE_UPLOAD_FAILED("5002", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_TOO_LARGE("5003", HttpStatus.PAYLOAD_TOO_LARGE),
    INVALID_FILE_TYPE("5004", HttpStatus.BAD_REQUEST),
    S3_UPLOAD_FAILED("5005", HttpStatus.INTERNAL_SERVER_ERROR),

    // Webhook (6xxx)
    WEBHOOK_PROCESSING_FAILED("6001", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_WEBHOOK_SIGNATURE("6002", HttpStatus.UNAUTHORIZED),

    // External API (7xxx)
    ZOOM_API_ERROR("7001", HttpStatus.BAD_GATEWAY),
    NOTION_API_ERROR("7002", HttpStatus.BAD_GATEWAY),
    FAST_API_ERROR("7003", HttpStatus.BAD_GATEWAY),

    // Validation (8xxx)
    INVALID_INPUT("8001", HttpStatus.BAD_REQUEST),
    MISSING_REQUIRED_FIELD("8002", HttpStatus.BAD_REQUEST),
    METHOD_NOT_ALLOWED("8003", HttpStatus.METHOD_NOT_ALLOWED),

    // System (9xxx)
    INTERNAL_SERVER_ERROR("9001", HttpStatus.INTERNAL_SERVER_ERROR),
    SERVICE_UNAVAILABLE("9002", HttpStatus.SERVICE_UNAVAILABLE),
    REDIS_CONNECTION_ERROR("9003", HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final HttpStatus httpStatus;
}