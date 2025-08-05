package com.ssafy.record.domain.user.dto.request;


import com.ssafy.record.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRequestDto {

    private String recordId;
    private String bojId;
    private String email;
    private String nickname;
    private String password;
    private String profileUrl;
    private String bio;

    @Builder
    public UserRequestDto(String recordId, String bojId, String email,
                          String nickname, String password,
                          String profileUrl, String bio) {
        this.recordId = recordId;
        this.bojId = bojId;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.profileUrl = profileUrl;
        this.bio = bio;
    }

    public User toEntity() {
        return User.builder()
                .recordId(recordId)
                .bojId(bojId)
                .email(email)
                .nickname(nickname)
                .password(password)
                .image(profileUrl)
                .userTier(0)
                .bio(bio)
                .isDeleted(false)
                .build();
    }
}
