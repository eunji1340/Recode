package com.ssafy.recode.domain.user.dto.response;

import com.ssafy.recode.domain.user.entity.User;
import lombok.Getter;

@Getter
public class LoginResponseDto {
    private Long userId;
    private String nickname;
    private String accessToken;

    public LoginResponseDto(User user, String accessToken) {
        this.userId = user.getUserId();
        this.nickname = user.getNickname();
        this.accessToken = accessToken;
    }
}
