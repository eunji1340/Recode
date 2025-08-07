package com.ssafy.recode.domain.note.dto.response;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.solvedac.dto.ProblemDto;
import com.ssafy.recode.domain.tag.entity.Tag;
import com.ssafy.recode.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class NoteFeedDto {
    private Long noteId;
//    private Long userId;
    private ProblemDto problem;
    private UserDto user;
    private String noteTitle;
    private String content;

    private String successCode;
    private String successCodeStart;
    private String successCodeEnd;
    private String successLanguage;

    private String failCode;
    private String failCodeStart;
    private String failCodeEnd;
    private String failLanguage;

    private Boolean isPublic;
    private Boolean isdeleted;
    private boolean isLiked;
    private boolean isFollowing;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private int viewCount;
    private Integer likeCount;
    private Integer commentCount;

    private List<String> tags;

    @Getter
    @Builder
    public static class ProblemDto{
        private Long problemId;
        private String problemName;
        private int problemTier;
    }

    @Getter
    @Builder
    public static class UserDto{
        private Long userId;
        private String bojId;
        private String nickname;
        private int userTier;
    }

    public static NoteFeedDto from(Note note) {
        return NoteFeedDto.builder()
                .noteId(note.getNoteId())
                .noteTitle(note.getNoteTitle())
                .content(note.getContent())
                .successCode(note.getSuccessCode())
                .successCodeStart(String.valueOf(note.getSuccessCodeStart()))
                .successCodeEnd(String.valueOf(note.getSuccessCodeEnd()))
                .successLanguage(note.getSuccessLanguage())
                .failCode(note.getFailCode())
                .failCodeStart(String.valueOf(note.getFailCodeStart()))
                .failCodeEnd(String.valueOf(note.getFailCodeEnd()))
                .failLanguage(note.getFailLanguage())
                .isPublic(note.getIsPublic())
                .isdeleted(note.getIsDeleted())
                .isLiked(note.getIsLiked())
                .isFollowing(note.getIsFollowing())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .viewCount(note.getViewCount())
                .likeCount(note.getLikeCount())
                .commentCount(note.getCommentCount())
                .problem(ProblemDto.builder()
                        .problemId(note.getProblemId())
                        .problemName(note.getProblemName())
                        .problemTier(note.getProblemTier())
                        .build())
                .user(UserDto.builder()
                        .userId(note.getUser().getUserId())
                        .bojId(note.getUser().getBojId())
                        .nickname(note.getUser().getNickname())
                        .userTier(note.getUser().getUserTier())
                        .build())
                .tags(note.getTags() != null ?
                        note.getTags().stream()
                                .map(Tag::getTagName)
                                .toList()
                        : List.of()
                )
                .build();
    }

    public static NoteFeedDto fromEntity(Note note) {
        return from(note);
    }

}
