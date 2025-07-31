package com.ssafy.recode.domain.note.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteRequestDto {
    private Long problemId;
    private String problemName;
    private Integer problemTier;
    private String noteTitle;
    private String content;
    private String successCode;
    private Integer successCodeStart;
    private Integer successCodeEnd;
    private String failCode;
    private Integer failCodeStart;
    private Integer failCodeEnd;
    private Boolean isPublic;
}

