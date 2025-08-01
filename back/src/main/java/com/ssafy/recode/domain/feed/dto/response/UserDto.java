package com.ssafy.recode.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {
    private Long userId;
    private String bojId;
    private String nickname;
    private int userTier;
}
