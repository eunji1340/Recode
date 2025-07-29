package com.ssafy.record.domain.note.dto.response;

import com.ssafy.record.domain.note.entity.Note;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NoteResponseDto {
    private Long noteId;
    private Long userId;
    private String nickname;
    private String problemId;
    private String problemName;
    private int problemTier;
    private String noteTitle;
    private String content;
    private String successCode;
    private String successCodeStart;
    private String successCodeEnd;
    private String failCode;
    private String failCodeStart;
    private String failCodeEnd;
    private int viewCount;
    private Boolean isPublic;
    private LocalDateTime createdAt;

    public static NoteResponseDto from(Note note) {
        return NoteResponseDto.builder()
                .noteId(note.getNoteId())
                .userId(note.getUser().getUserId())
                .nickname(note.getUser().getNickname())
                .problemId(String.valueOf(note.getProblemId()))
                .problemName(note.getProblemName())
                .problemTier(note.getProblemTier())
                .noteTitle(note.getNoteTitle())
                .content(note.getContent())
                .successCode(note.getSuccessCode())
                .successCodeStart(String.valueOf(note.getSuccessCodeStart()))
                .successCodeEnd(String.valueOf(note.getSuccessCodeEnd()))
                .failCode(note.getFailCode())
                .failCodeStart(String.valueOf(note.getFailCodeStart()))
                .failCodeEnd(String.valueOf(note.getFailCodeEnd()))
                .viewCount(note.getViewCount())
                .isPublic(note.getIsPublic())
                .createdAt(note.getCreatedAt())
                .build();
    }

    public static NoteResponseDto fromEntity(Note note) {
        return from(note);
    }

}
