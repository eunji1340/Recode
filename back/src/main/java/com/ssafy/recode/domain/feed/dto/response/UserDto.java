package com.ssafy.recode.domain.feed.dto.response;

import com.ssafy.recode.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {
    private Long userId;
    private String bojId;
    private String nickname;
    private int userTier;

    public static UserDto from(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .bojId(user.getBojId())
                .nickname(user.getNickname())
                .userTier(user.getUserTier())
                .build();
    }
}
