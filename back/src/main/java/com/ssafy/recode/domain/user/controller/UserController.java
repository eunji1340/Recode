package com.ssafy.recode.domain.user.controller;

import com.ssafy.recode.domain.user.CookieUtil;
import com.ssafy.recode.domain.user.dto.request.*;
import com.ssafy.recode.domain.user.dto.response.LoginResponseDto;
import com.ssafy.recode.domain.user.dto.response.TokenPair;
import com.ssafy.recode.domain.user.dto.response.UserListResponseDto;
import com.ssafy.recode.domain.user.dto.response.UserResponseDto;
import com.ssafy.recode.domain.user.service.UserService;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @PostMapping("/login")
    public ResponseEntity<ApiSingleResponse<LoginResponseDto>> login(@RequestBody LoginRequestDto dto, HttpServletResponse response) {

        // 1. 로그인 처리 (토큰 2개 + 사용자 정보 반환)
        TokenPair result = userService.login(dto);

        // 2. RefreshToken 쿠키를 SameSite=None; Secure; HttpOnly로 직접 설정
//        CookieUtil.addSameSiteCookie(response, "refreshToken", result.getRefreshToken(), 30); // 배포시 코드
        CookieUtil.addTestCookie(response, "refreshToken", result.getRefreshToken(), 30);

        // 3. AccessToken + 사용자 정보 JSON 바디로 응답
        LoginResponseDto responseDto = new LoginResponseDto(result.getUser(), result.getAccessToken());

        return ResponseEntity.ok(ApiSingleResponse.from(responseDto));
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

    /**
     * 11. 토큰 재발급
     * 기존 refreshToken을 이용해 accessToken + refreshToken 재발급
     * 재발급된 refreshToken을 Secure + HttpOnly + SameSite=None 쿠키로 다시 설정
     */
    @PostMapping("/reissue")
    public ResponseEntity<ApiSingleResponse<LoginResponseDto>> reissue(HttpServletRequest request, HttpServletResponse response) {

        // 요청 쿠키에서 refreshToken 추출
        String refreshToken = CookieUtil.extractTokenFromCookie(request, "refreshToken");

        // 서비스 레이어에서 토큰 재발급 처리 (유효성 검사 포함)
        TokenPair tokenPair = userService.reissueToken(refreshToken);

        // 새로운 refreshToken을 SameSite=None; Secure; HttpOnly 쿠키로 설정
//        CookieUtil.addSameSiteCookie(response, "refreshToken", tokenPair.getRefreshToken(), 30); // 배포 시 코드
        CookieUtil.addTestCookie(response, "refreshToken", tokenPair.getRefreshToken(), 30);

        // 재발급된 accessToken과 사용자 정보를 JSON으로 응답
        LoginResponseDto dto = new LoginResponseDto(tokenPair.getUser(), tokenPair.getAccessToken());
        return ResponseEntity.ok(ApiSingleResponse.from(dto));
    }

    /** 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<ApiSingleResponse<String>> logout(HttpServletResponse response) {
//        CookieUtil.deleteCookie(response, "refreshToken"); // 배포 시 코드
        CookieUtil.deleteTestCookie(response, "refreshToken");
        return ResponseEntity.ok(ApiSingleResponse.from("성공적으로 로그아웃 되었습니다."));
    }
}