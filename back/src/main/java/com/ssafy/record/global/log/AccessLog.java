package com.ssafy.record.global.log;

import com.ssafy.record.global.entity.NoSqlEntity;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder
public class AccessLog extends NoSqlEntity {

    @Field("method")
    private String method;

    @Field("path")
    private String path;

    @Field("status")
    private int status;

    @Field("duration_ms")
    private long durationMs;

    @Field("user_id")
    private String userId;

    @Field("user_agent")
    private String userAgent;

    @Field("client_ip")
    private String clientIp;

    @Field("error_message")
    private String errorMessage;
}
