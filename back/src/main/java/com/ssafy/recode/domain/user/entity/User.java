package com.ssafy.recode.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String recodeId;

    @Column(nullable = false, unique = true, length = 255)
    private String bojId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, unique = true, length = 255)
    private String nickname;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private int userTier;

    @Column(length = 255)
    private String bio;

    @Column(nullable = false)
    private boolean isDeleted;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void markAsDeleted() {
        this.isDeleted = true;
    }

}
