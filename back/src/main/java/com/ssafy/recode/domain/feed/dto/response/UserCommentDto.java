package com.ssafy.recode.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserCommentDto {

    private Long noteId;
    private String noteTitle;
    private String commentWriter;
    private String content;
    private String successLanguage;

    private Boolean isPublic;
    private String createdAt;
    private String updatedAt;
    private boolean isDeleted;
    private boolean isLiked;
    private boolean isFollowing;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private UserDto user;
    private ProblemDto problem;
    private List<TagDto> tags;
}