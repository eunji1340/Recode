package com.ssafy.recode.domain.follow.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.follow.dto.response.FollowResponseDto;
import com.ssafy.recode.domain.follow.service.FollowService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follow")
@SecurityRequirement(name = "bearer-key")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 1. 팔로우 하기
    @PostMapping("/{followId}")
    public ResponseEntity<Void> follow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @PathVariable Long followId) {
        Long userId = userDetails.getUser().getUserId();
        followService.follow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 2. 언팔로우 하기
    @DeleteMapping("/{followId}")
    public ResponseEntity<Void> unfollow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @PathVariable Long followId) {
        Long userId = userDetails.getUser().getUserId();
        followService.unfollow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 3. 내 팔로워 조회
    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        List<FollowResponseDto> result = followService.getFollowers(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 4. 내 팔로잉 조회
    @GetMapping("/followings")
    public ResponseEntity<?> getFollowings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        List<FollowResponseDto> result = followService.getFollowings(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }
}
