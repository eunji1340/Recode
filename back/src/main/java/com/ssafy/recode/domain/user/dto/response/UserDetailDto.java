package com.ssafy.recode.domain.user.dto.response;

import com.ssafy.recode.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
public class UserDetailDto {
    private String recodeId;
    private String bojId;
    private String email;
    private String nickname;
    private String image;
    private String password;
    private int userTier;
    private String bio;

    @Builder
    public UserDetailDto(User entity) {
        this.recodeId = entity.getRecodeId();
        this.bojId = entity.getBojId();
        this.email = entity.getEmail();
        this.nickname = entity.getNickname();
        this.image = entity.getImage();
        this.password = entity.getPassword();
        this.userTier = entity.getUserTier();
        this.bio = entity.getBio();
    }
}
