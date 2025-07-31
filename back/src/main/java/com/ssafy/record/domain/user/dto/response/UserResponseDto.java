package com.ssafy.record.domain.user.dto.response;

import com.ssafy.record.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private Long userId;        // user_id
//    private String recordId;    // record_id
    private String bojId;       // boj_id
//    private String email;       // email
//    private String nickname;    // nickname
//    private String image;       // image (nullable)
//    private int userTier;       // user_tier
//    private String bio;         // bio (nullable)
//    private boolean isDeleted;  // is_deleted

    @Builder
    public UserResponseDto(User entity) {
        this.userId = entity.getUserId();
//        this.recordId = entity.getRecordId();
        this.bojId = entity.getBojId();
//        this.email = entity.getEmail();
//        this.nickname = entity.getNickname();
//        this.image = entity.getImage();
//        this.userTier = entity.getUserTier();
//        this.bio = entity.getBio();
//        this.isDeleted = entity.isDeleted();
    }
}
