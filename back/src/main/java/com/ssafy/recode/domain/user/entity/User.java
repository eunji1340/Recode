package com.ssafy.recode.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.openqa.selenium.Cookie;

import java.util.HashSet;
import java.util.Set;

@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
@Getter
@Setter
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

    @Column(name = "image", length = 255)
    private String image;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private int userTier;

    @Column(length = 255)
    private String bio;

    @Column(nullable = false)
    private boolean isDeleted;

    @Column(length = 4096)
    private String bojCookiesJson;

    @Column(length = 4096)
    private String bojCookieValue;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void markAsDeleted() {
        this.isDeleted = true;
    }

    public void updateUserTier(int newTier) {
        this.userTier = newTier;
    }

    public void updateImage(String image) {
        this.image = image;
    }

    public void updateEmail(String email) { this.email = email; }

    public void updateBio(String bio) { this.bio = bio; }

    public void setBojCookieValue(String cookieValue) {
        this.bojCookieValue = cookieValue;
    }

    public Set<Cookie> getBojCookies() {
        if (this.bojCookieValue == null || this.bojCookieValue.isEmpty()) {
            return null;
        }
        Set<Cookie> cookies = new HashSet<>();
        cookies.add(
                new Cookie.Builder("OnlineJudge", this.bojCookieValue)
                        .domain(".acmicpc.net")
                        .path("/")
                        .isSecure(true)
                        .isHttpOnly(false)
                        .build()
        );
        return cookies;
    }

    public void setBojCookiesJson(String json) {
        this.bojCookiesJson = json;
    }

}
