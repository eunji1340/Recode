package com.ssafy.record.domain.solvedac.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AutocompleteItemDto {
    private String caption;
    private String description;

    public AutocompleteItemDto(String caption, String description) {
        this.caption = caption;
        this.description = description;
    }
}
