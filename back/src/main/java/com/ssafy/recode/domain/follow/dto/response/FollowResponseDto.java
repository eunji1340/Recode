package com.ssafy.recode.domain.follow.dto.response;

import com.ssafy.recode.domain.user.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FollowResponseDto {

    private Long userId;
    private String bojId;
    private String nickname;
    private int userTier;

    public FollowResponseDto(User user) {
        this.userId = user.getUserId();
        this.bojId = user.getBojId();
        this.nickname = user.getNickname();
        this.userTier = user.getUserTier();
    }
}
