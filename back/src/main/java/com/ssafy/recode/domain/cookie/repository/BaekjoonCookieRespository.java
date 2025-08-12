package com.ssafy.recode.domain.cookie.repository;

import com.ssafy.recode.domain.cookie.entity.BaekjoonCookie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaekjoonCookieRespository extends JpaRepository<BaekjoonCookie, Long> {

    /**
     * 특정 사용자 ID로 쿠키 조회
     */
    Optional<BaekjoonCookie> findByUserId(Long userId);
}
