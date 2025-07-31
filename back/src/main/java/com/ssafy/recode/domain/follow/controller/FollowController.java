package com.ssafy.recode.domain.follow.controller;

import com.ssafy.recode.domain.follow.dto.response.FollowResponseDto;
import com.ssafy.recode.domain.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 1. 팔로우 하기
    @PostMapping("/{followId}")
    public ResponseEntity<Void> follow(@RequestHeader("userId") Long userId,
                                       @PathVariable Long followId) {
        followService.follow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 2. 언팔로우 하기
    @DeleteMapping("/{followId}")
    public ResponseEntity<Void> unfollow(@RequestHeader("userId") Long userId,
                                         @PathVariable Long followId) {
        followService.unfollow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 3. 내 팔로워 조회
    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(@RequestHeader("userId") Long userId) {
        List<FollowResponseDto> result = followService.getFollowers(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 4. 내 팔로잉 조회
    @GetMapping("/followings")
    public ResponseEntity<?> getFollowings(@RequestHeader("userId") Long userId) {
        List<FollowResponseDto> result = followService.getFollowings(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }
}
