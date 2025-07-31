package com.ssafy.recode.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class FeedResponseDto {

    private Long noteId;
    private String content;

    private Integer successCodeStart;
    private Integer successCodeEnd;
    private Integer failCodeStart;
    private Integer failCodeEnd;

    private Boolean isPublic;
    private String createdAt;
    private String updatedAt;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private UserDto user;
    private ProblemDto problem;
    private List<String> tags;

    @Getter
    @Builder
    public static class UserDto {
        private Long userId;
        private String bojId;
        private String nickname;
        private int userTier;
    }

    @Getter
    @Builder
    public static class ProblemDto {
        private Integer problemId;
        private String problemName;
        private Integer problemTier;
    }
}
