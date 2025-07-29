package com.ssafy.record.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeedResponseDto {
    private Long commentId;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;
}
