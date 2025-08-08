package com.ssafy.recode.domain.user.controller;

import com.ssafy.recode.domain.user.CookieUtil;
import com.ssafy.recode.domain.user.dto.request.*;
import com.ssafy.recode.domain.user.dto.response.LoginResponseDto;
import com.ssafy.recode.domain.user.dto.response.TokenPair;
import com.ssafy.recode.domain.user.dto.request.CookieRequestDto;
import com.ssafy.recode.domain.user.dto.request.UserRequestDto;
import com.ssafy.recode.domain.user.dto.response.UserListResponseDto;
import com.ssafy.recode.domain.user.dto.response.UserResponseDto;
import com.ssafy.recode.domain.user.service.UserService;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "bearer-key")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 1. 회원가입 */
    @Operation(summary = "회원가입", description = "신규 사용자를 등록합니다.")
    @PostMapping("/register")
    public ResponseEntity<ApiSingleResponse<UserResponseDto>> register(@RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.register(dto)));
    }

    /** 2. 로그인 */
    @Operation(summary = "로그인", description = "아이디와 비밀번호를 통해 로그인하고 토큰을 발급합니다.")
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

    /** 3. 백준 ID 유효성 확인 */
    @Operation(summary = "백준 ID 유효성 확인", description = "입력한 백준 ID가 유효한지와 중복 여부를 확인합니다.")
    @PostMapping("/bojId_check")
    public ResponseEntity<ApiSingleResponse<Boolean>> validateBojId(@RequestBody BojIdCheckRequest bojId) {
        int tier = userService.fetchBojTier(bojId.getBojId());
        boolean existsInDb = userService.existsByBojId(bojId.getBojId());
        boolean isValid = tier >= 0 && !existsInDb;
        return ResponseEntity.ok(ApiSingleResponse.from(isValid));
    }

    /** 4. Recode ID 중복 확인 */
    @Operation(summary = "Recode ID 중복 확인", description = "Recode ID가 이미 사용 중인지 확인합니다.")
    @PostMapping("/recodeId_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkRecodeId(@RequestBody RecodeIdDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isRecodeIdDuplicated(dto.getRecodeId())));
    }

    /** 5. 닉네임 중복 확인 */
    @Operation(summary = "닉네임 중복 확인", description = "닉네임이 이미 사용 중인지 확인합니다.")
    @PostMapping("/nickname_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkNickname(@RequestBody NicknameDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isNicknameDuplicated(dto.getNickname())));
    }

    /** 6. 이메일 중복 확인 */
    @Operation(summary = "이메일 중복 확인", description = "이메일이 이미 사용 중인지 확인합니다.")
    @PostMapping("/email_dupcheck")
    public ResponseEntity<ApiSingleResponse<Boolean>> checkEmail(@RequestBody EmailDupCheckRequest dto) {
        return ResponseEntity.ok(ApiSingleResponse.from(userService.isEmailDuplicated(dto.getEmail())));
    }

    /** 7. 닉네임 변경 */
    @Operation(summary = "닉네임 변경", description = "특정 사용자의 닉네임을 변경합니다.")
    @PatchMapping("/{userId}/nickname")
    public ResponseEntity<Void> updateNickname(@PathVariable Long userId,
                                               @RequestBody NicknameUpdateRequest dto) {
        userService.updateNickname(userId, dto.getNickname());
        return ResponseEntity.ok().build();
    }

    /** 8. 비밀번호 변경 */
    @Operation(summary = "비밀번호 변경", description = "특정 사용자의 비밀번호를 변경합니다.")
    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long userId,
                                               @RequestBody UpdatePasswordRequest dto) {
        userService.updatePassword(userId, dto.getCurrPassword(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    /** 9. 전체 회원 조회 */
    @Operation(summary = "전체 회원 조회", description = "모든 사용자의 정보를 조회합니다.")
    @GetMapping
    public ResponseEntity<UserListResponseDto> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new UserListResponseDto(users.size(), users));
    }

    /** 10. 특정 회원 조회 */
    @Operation(summary = "회원 정보 조회", description = "사용자 ID로 특정 사용자의 정보를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /** 11. 회원 탈퇴 */
    @Operation(summary = "회원 탈퇴", description = "사용자 ID를 기반으로 회원을 삭제합니다.")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 12. 토큰 재발급
     * 기존 refreshToken을 이용해 accessToken + refreshToken 재발급
     * 재발급된 refreshToken을 Secure + HttpOnly + SameSite=None 쿠키로 다시 설정
     */
    @Operation(summary = "토큰 재발급", description = "쿠키의 refreshToken을 통해 accessToken과 refreshToken을 재발급합니다.")
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

    /** 13. 로그아웃 */
    @Operation(summary = "로그아웃", description = "쿠키에서 refreshToken을 삭제하여 로그아웃합니다.")
    @PostMapping("/logout")
    public ResponseEntity<ApiSingleResponse<String>> logout(HttpServletResponse response) {
//        CookieUtil.deleteCookie(response, "refreshToken"); // 배포 시 코드
        CookieUtil.deleteTestCookie(response, "refreshToken");
        return ResponseEntity.ok(ApiSingleResponse.from("성공적으로 로그아웃 되었습니다."));
    }

    /** 14. 백준 쿠키 저장 **/
    @Operation(summary = "백준 쿠키 저장", description = "백준에서 세션 쿠키를 추출하여 저장합니다.")
    @PostMapping("/{userId}/boj-cookies")
    public ResponseEntity<?> saveBojCookies(@PathVariable Long userId, @RequestBody CookieRequestDto cookieRequestDto ) {
        userService.saveBojCookieValue(userId, cookieRequestDto.getCookieValue());
        return ResponseEntity.ok("백준 쿠키가 성공적으로 저장되었습니다.");
    }
}
