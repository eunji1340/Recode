package com.ssafy.recode.domain.cookie.controller;

import com.ssafy.recode.domain.cookie.dto.request.BaekjoonCookieRequestDto;
import com.ssafy.recode.domain.cookie.service.BaekjoonCookieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/boj-cookie")
@RequiredArgsConstructor
public class BaekjoonCookieController {

    private final BaekjoonCookieService baekjoonCookieService;

    // bojautologin 쿠키 저장
    @PostMapping
    public ResponseEntity<Void> saveCookie(@RequestBody BaekjoonCookieRequestDto dto){
        baekjoonCookieService.saveCookie(dto);
        return ResponseEntity.ok().build();
    }

}
