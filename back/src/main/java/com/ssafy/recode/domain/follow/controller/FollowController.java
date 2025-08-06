package com.ssafy.recode.domain.follow.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.follow.dto.response.FollowResponseDto;
import com.ssafy.recode.domain.follow.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "팔로우 하기", description = "다른 사용자를 팔로우합니다.")
    @PostMapping("/{followId}")
    public ResponseEntity<Void> follow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @PathVariable Long followId) {
        Long userId = userDetails.getUser().getUserId();
        followService.follow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 2. 언팔로우 하기
    @Operation(summary = "언팔로우 하기", description = "팔로우 중인 사용자를 언팔로우합니다.")
    @DeleteMapping("/{followId}")
    public ResponseEntity<Void> unfollow(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @PathVariable Long followId) {
        Long userId = userDetails.getUser().getUserId();
        followService.unfollow(userId, followId);
        return ResponseEntity.ok().build();
    }

    // 3. 내 팔로워 조회
    @Operation(summary = "내 팔로워 조회", description = "로그인한 사용자의 팔로워 목록을 조회합니다.")
    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        List<FollowResponseDto> result = followService.getFollowers(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 4. 내 팔로잉 조회
    @Operation(summary = "내 팔로잉 조회", description = "로그인한 사용자의 팔로잉 목록을 조회합니다.")
    @GetMapping("/followings")
    public ResponseEntity<?> getFollowings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        List<FollowResponseDto> result = followService.getFollowings(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 5. 타인 팔로워 조회
    @Operation(summary = "타인 팔로워 조회", description = "다른 사용자의 팔로워 목록을 조회합니다.")
    @GetMapping("/followers/{userId}")
    public ResponseEntity<?> getFollowersByUserId(@PathVariable long userId) {
        List<FollowResponseDto> result = followService.getFollowers(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 6. 타인 팔로잉 조회
    @Operation(summary = "타인 팔로잉 조회", description = "다른 사용자의 팔로잉 목록을 조회합니다.")
    @GetMapping("/followings/{userId}")
    public ResponseEntity<?> getFollowingsByUserId(@PathVariable long userId) {
        List<FollowResponseDto> result = followService.getFollowings(userId);
        return ResponseEntity.ok().body(Map.of("data", Map.of("details", result)));
    }

    // 7. userId로 팔로워 카운트 조회
    @Operation(summary = "팔로워 수 조회", description = "사용자의 팔로워 수를 조회합니다.")
    @GetMapping("/followers/count/{userId}")
    public ResponseEntity<?> getFollowersCount(@PathVariable long userId) {
        List<FollowResponseDto> result = followService.getFollowers(userId);
        long count = result.size();
        return ResponseEntity.ok().body(count);
    }

    // 8. userId로 팔로잉 카운트 조회
    @Operation(summary = "팔로잉 수 조회", description = "사용자의 팔로잉 수를 조회합니다.")
    @GetMapping("/followings/count/{userId}")
    public ResponseEntity<?> getFollowingsCount(@PathVariable long userId) {
        List<FollowResponseDto> result = followService.getFollowings(userId);
        long count = result.size();
        return ResponseEntity.ok().body(count);
    }
}
