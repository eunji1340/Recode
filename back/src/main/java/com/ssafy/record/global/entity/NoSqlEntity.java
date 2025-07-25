package com.ssafy.record.global.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

public abstract class NoSqlEntity {
    @Id
    protected String id;

    @Field("created_at")
    protected LocalDateTime createdAt = LocalDateTime.now();

    @Field("updated_at")
    protected LocalDateTime updatedAt = LocalDateTime.now();
}
