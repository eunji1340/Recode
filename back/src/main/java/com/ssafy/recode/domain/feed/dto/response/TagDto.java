package com.ssafy.recode.domain.feed.dto.response;

import com.ssafy.recode.domain.tag.entity.Tag;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TagDto {
    private Long tagId;
    private String tagName;

    public static TagDto from(Tag tag) {
        return TagDto.builder()
                .tagId(tag.getTagId())
                .tagName(tag.getTagName())
                .build();
    }
}
