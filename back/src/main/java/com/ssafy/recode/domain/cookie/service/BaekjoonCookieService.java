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

    public void saveCookie(BaekjoonCookieRequestDto dto, Long userId) {
        BaekjoonCookie existing = baekjoonCookieRespository.findByUserId(userId)
                .orElse(null);

        if (existing != null) {
            existing.setCookieValue(dto.getCookieValue());
            existing.setExpiresAt(LocalDateTime.now().plusDays(7));
            baekjoonCookieRespository.save(existing);
        } else {
            BaekjoonCookie cookie = BaekjoonCookie.builder()
                    .userId(userId)
                    .cookieValue(dto.getCookieValue())
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            baekjoonCookieRespository.save(cookie);
        }
    }
}
