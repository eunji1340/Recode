package com.ssafy.recode.domain.user.controller;

import com.ssafy.recode.domain.user.dto.request.*;
import com.ssafy.recode.domain.user.dto.response.UserListResponseDto;
import com.ssafy.recode.domain.user.dto.response.UserResponseDto;
import com.ssafy.recode.domain.user.service.UserService;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ApiSingleResponse<UserResponseDto>> login(@RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.login(dto.getRecodeId(), dto.getPassword())));
    }

    /** 백준ID 유효성 확인 */
    @PostMapping("/bojId_check")
    public ResponseEntity<ApiSingleResponse<Boolean>> validateBojId(@RequestBody BojIdCheckRequest bojId) {
        int tier = userService.fetchBojTier(bojId.getBojId());
        boolean existsInDb = userService.existsByBojId(bojId.getBojId());
        boolean isValid = tier >= 0 && !existsInDb;
        return ResponseEntity.ok(ApiSingleResponse.from(isValid));
    }

    /** 3. recodeId 중복 확인 */
    @PostMapping("/recodeId_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkRecodeId(@RequestBody RecodeIdDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isRecodeIdDuplicated(dto.getRecodeId())));
    }

    /** 4. 닉네임 중복 확인 */
    @PostMapping("/nickname_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkNickname(@RequestBody NicknameDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isNicknameDuplicated(dto.getNickname())));
    }

    /** 5. 이메일 중복 확인 */
    @PostMapping("/email_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkEmail(@RequestBody EmailDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isEmailDuplicated(dto.getEmail())));
    }

    /** 6. 닉네임 변경 */
    @PatchMapping("/{userId}/nickname")
    public ResponseEntity<Void> updateNickname(@PathVariable Long userId,
                                               @RequestBody NicknameUpdateRequest dto) {
        userService.updateNickname(userId, dto.getNickname());
        return ResponseEntity.ok().build();
    }

    /** 7. 비밀번호 변경 */
    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long userId,
                                               @RequestBody UpdatePasswordRequest dto) {
        userService.updatePassword(userId, dto.getCurrPassword(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    /** 8. 전체 회원 정보 조회 */
    @GetMapping
    public ResponseEntity<UserListResponseDto> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new UserListResponseDto(users.size(), users));
    }

    /** 9. 특정 회원 정보 조회 */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /** 10. 회원 탈퇴 */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
