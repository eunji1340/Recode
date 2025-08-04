package com.ssafy.record.domain.user.controller;

import com.ssafy.record.domain.user.dto.request.UserRequestDto;
import com.ssafy.record.domain.user.dto.response.UserResponseDto;
import com.ssafy.record.domain.user.service.UserService;
import com.ssafy.record.global.dto.response.ApiSingleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 1. 회원가입 */
    @PostMapping("/register")
    public ResponseEntity<ApiSingleResponse<UserResponseDto>> register(@RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.register(dto)));
    }

    /** 2. 로그인 */
    @PostMapping("/login")
    public ResponseEntity<ApiSingleResponse<UserResponseDto>> login(@RequestParam String email,
                                                                    @RequestParam String password) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.login(email, password)));
    }

    /** 3. recordId 중복 확인 */
    @GetMapping("/userId_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkRecordId(@RequestParam String recordId) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isRecordIdDuplicated(recordId)));
    }

    /** 4. 닉네임 중복 확인 */
    @GetMapping("/nickname_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isNicknameDuplicated(nickname)));
    }

    /** 5. 이메일 중복 확인 */
    @GetMapping("/email_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isEmailDuplicated(email)));
    }

    /** 6. 닉네임 변경 */
    @PatchMapping("/{userId}/nickname")
    public ResponseEntity<Void> updateNickname(@PathVariable Long userId,
                                               @RequestParam String nickname) {
        userService.updateNickname(userId, nickname);
        return ResponseEntity.ok().build();
    }

    /** 7. 프로필 이미지 변경 */
    @PatchMapping("/{userId}/image")
    public ResponseEntity<Void> updateProfileImage(@PathVariable Long userId,
                                                   @RequestParam String imageUrl) {
        userService.updateProfileImage(userId, imageUrl);
        return ResponseEntity.ok().build();
    }

    /** 8. 비밀번호 변경 */
    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long userId,
                                               @RequestParam String currPassword,
                                               @RequestParam String newPassword) {
        userService.updatePassword(userId, currPassword, newPassword);
        return ResponseEntity.ok().build();
    }
}
