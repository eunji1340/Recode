package com.ssafy.recode.domain.feed.dto.response;

import com.ssafy.recode.domain.tag.entity.Tag;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class FeedResponseDto {

    private Long noteId;
    private String noteTitle;
    private String content;

    private String successCode;
    private Integer successCodeStart;
    private Integer successCodeEnd;
    private String successLanguage;
    private String failCode;
    private Integer failCodeStart;
    private Integer failCodeEnd;
    private String failLanguage;

    private Boolean isPublic;
    private String createdAt;
    private String updatedAt;
    private boolean isDeleted;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private UserDto user;
    private ProblemDto problem;
    private List<TagDto> tags;

}

