package com.ssafy.recode.domain.cookie.service;

import com.ssafy.recode.domain.cookie.dto.request.BaekjoonCookieRequestDto;
import com.ssafy.recode.domain.cookie.entity.BaekjoonCookie;
import com.ssafy.recode.domain.cookie.repository.BaekjoonCookieRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BaekjoonCookieService {

    private final BaekjoonCookieRespository baekjoonCookieRespository;

    public void saveCookie(BaekjoonCookieRequestDto dto) {
        // userId 기준으로 기존 쿠키 조회
        BaekjoonCookie existing = baekjoonCookieRespository.findByUserId(dto.getUserId())
                .orElse(null);

        if (existing != null) {
            // 기존 쿠키가 있으면 값과 만료일만 갱신
            existing.setCookieValue(dto.getCookieValue());
            existing.setExpiresAt(LocalDateTime.now().plusDays(7));
            baekjoonCookieRespository.save(existing);
        } else {
            // 새로 생성
            BaekjoonCookie cookie = BaekjoonCookie.builder()
                    .userId(dto.getUserId())
                    .cookieValue(dto.getCookieValue())
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            baekjoonCookieRespository.save(cookie);
        }
    }
}
