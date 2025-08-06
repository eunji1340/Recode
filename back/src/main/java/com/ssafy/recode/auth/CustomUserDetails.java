package com.ssafy.recode.auth;

import com.ssafy.recode.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 사용자 ID(Long)를 반환 (내부 로직에서 사용하기 위함)
    public Long getUserId() {
        return user.getUserId();
    }

    // 사용자의 권한 목록 반환 (현재는 사용하지 않으므로 빈 리스트)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    // 인증에 사용할 비밀번호 반환
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 인증에 사용할 사용자명 반환 (여기서는 recodeId를 기준으로 로그인)
    @Override
    public String getUsername() {
        return user.getRecodeId();
    }

    // 계정 만료 여부 (true: 만료되지 않음)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠김 여부 (true: 잠기지 않음)
    // 사용자 삭제 처리 여부를 기반으로 판단
    @Override
    public boolean isAccountNonLocked() {
        return !user.isDeleted();
    }

    // 비밀번호 만료 여부 (true: 만료되지 않음)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 활성화 여부 (true: 활성 상태)
    @Override
    public boolean isEnabled() {
        return !user.isDeleted(); // 삭제된 사용자는 비활성 처리
    }

    // 내부에서 원본 User 객체에 접근할 수 있도록 반환
    public User getUser() {
        return user;
    }
}
