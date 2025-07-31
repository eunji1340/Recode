package com.ssafy.recode.domain.user.dto.request;


import com.ssafy.recode.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRequestDto {

    private String recodeId;
    private String bojId;
    private String email;
    private String nickname;
    private String password;
    private String bio;
    private Integer userTier;

    @Builder
    public UserRequestDto(String recodeId, String bojId, String email,
                          String nickname, String password,
                          String bio) {
        this.recodeId = recodeId;
        this.bojId = bojId;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.bio = bio;
    }

    public void setTier(Integer tier) {
        this.userTier = tier;
    }

    public User toEntity() {
        return User.builder()
                .recodeId(recodeId)
                .bojId(bojId)
                .email(email)
                .nickname(nickname)
                .password(password)
                .bio(bio)
                .userTier(userTier)
                .isDeleted(false)
                .build();
    }
}
