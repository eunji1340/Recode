package com.ssafy.record.domain.user.controller;

import com.ssafy.record.domain.user.dto.request.UserRequestDto;
import com.ssafy.record.domain.user.dto.response.UserResponseDto;
import com.ssafy.record.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 1. 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    /** 2. 로그인 */
    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestParam String email,
                                                 @RequestParam String password) {
        return ResponseEntity.ok(userService.login(email, password));
    }

    /** 3. recordId 중복 확인 */
    @GetMapping("/check/recordId")
    public ResponseEntity<Boolean> checkRecordId(@RequestParam String recordId) {
        return ResponseEntity.ok(userService.isRecordIdDuplicated(recordId));
    }

    /** 4. 닉네임 중복 확인 */
    @GetMapping("/check/nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.isNicknameDuplicated(nickname));
    }

    /** 5. 이메일 중복 확인 */
    @GetMapping("/check/email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.isEmailDuplicated(email));
    }

    /** 6. 닉네임 변경 */
    @PatchMapping("/{userId}/nickname")
    public ResponseEntity<Void> updateNickname(@PathVariable Long userId,
                                               @RequestParam String nickname) {
        userService.updateNickname(userId, nickname);
        return ResponseEntity.ok().build();
    }

    /** 7. 프로필 이미지 변경 */
    @PatchMapping("/{userId}/profile-image")
    public ResponseEntity<Void> updateProfileImage(@PathVariable Long userId,
                                                   @RequestParam String imageUrl) {
        userService.updateProfileImage(userId, imageUrl);
        return ResponseEntity.ok().build();
    }

    /** 8. 비밀번호 변경 */
    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long userId,
                                               @RequestParam String newPassword) {
        userService.updatePassword(userId, newPassword);
        return ResponseEntity.ok().build();
    }
}
