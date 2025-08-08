package com.ssafy.recode.domain.cookie.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.cookie.dto.request.BaekjoonCookieRequestDto;
import com.ssafy.recode.domain.cookie.service.BaekjoonCookieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-key")
@RequestMapping("/boj-cookie")
public class BaekjoonCookieController {

    private final BaekjoonCookieService baekjoonCookieService;

    @Operation(summary = "백준 쿠키 저장", description = "백준 쿠키를 저장합니다.")
    @PostMapping
    public ResponseEntity<Void> saveCookie(@RequestBody BaekjoonCookieRequestDto dto,
                                           @AuthenticationPrincipal CustomUserDetails userDetails){
        Long userId = userDetails.getUser().getUserId();
        baekjoonCookieService.saveCookie(dto, userId);
        return ResponseEntity.ok().build();
    }

}
