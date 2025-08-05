package com.ssafy.recode.domain.note.dto.request;

import lombok.Getter;

@Getter
public class AiNoteRequestDto {
    private Long problemId;
    private String problemName;
    private Integer problemTier;

    private String successCode;
    private Integer successCodeStart;
    private Integer successCodeEnd;

    private String failCode;
    private Integer failCodeStart;
    private Integer failCodeEnd;

}
