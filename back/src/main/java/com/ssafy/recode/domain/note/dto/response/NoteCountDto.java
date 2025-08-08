package com.ssafy.recode.domain.note.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NoteCountDto {
    private String date;  // "2025.08.08" 형식
    private Long count;
}