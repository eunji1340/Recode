package com.ssafy.recode.domain.cookie.service;

import com.ssafy.recode.domain.cookie.dto.request.BaekjoonCookieRequestDto;
import com.ssafy.recode.domain.cookie.repository.BaekjoonCookieRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BaekjoonCookieService {

    private final BaekjoonCookieRespository baekjoonCookieRespository;

    public void saveCookie(BaekjoonCookieRequestDto dto) {
    }
}
