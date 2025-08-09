package com.ssafy.recode.domain.note.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NoteTagDto {
    private String tagName;
    private Long count;
}
