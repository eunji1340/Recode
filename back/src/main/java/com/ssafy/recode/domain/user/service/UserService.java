package com.ssafy.recode.domain.user.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.auth.JwtTokenProvider;
import com.ssafy.recode.domain.user.dto.request.LoginRequestDto;
import com.ssafy.recode.domain.user.dto.request.UserRequestDto;
import com.ssafy.recode.domain.user.dto.response.TokenPair;
import com.ssafy.recode.domain.user.dto.response.UserResponseDto;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import com.ssafy.recode.global.exception.BaseException;
import com.ssafy.recode.global.exception.CommonErrorCode;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    final Logger log = LoggerFactory.getLogger(UserService.class);


    /** 1. 회원가입 */
    public UserResponseDto register(UserRequestDto dto) {

        log.info("[회원가입 요청] 사용자명: {}, 백준 ID: {}", dto.getRecodeId(), dto.getBojId());

        int tier = fetchBojTier(dto.getBojId());
        if (tier < 0) {
            log.warn("[백준 ID 확인 실패] 존재하지 않는 ID: {}", dto.getBojId());
            throw new IllegalArgumentException("유효하지 않은 백준 ID입니다.");
        }
        dto.setTier(tier);

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        log.info("[백준 ID 확인 성공] 등록 가능한 ID: {}, 티어: {}", dto.getBojId(), tier);

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPassword);

        User user = userRepository.save(dto.toEntity());
        log.info("[회원가입 성공] 사용자명: {}, 백준 ID: {}", user.getRecodeId(), user.getBojId());

        return new UserResponseDto(user);
    }

    /** BOJ ID 유효성 및 티어 조회 */
    public int fetchBojTier(String bojId) {
        String url = "https://solved.ac/api/v3/search/user?query=" + bojId + "&page=1";

        try {
            log.debug("[BOJ ID 검증] URL 호출: {}", url);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            log.debug("[BOJ API 응답] Status Code: {}, Body: {}", response.statusCode(), response.body());

            if (response.statusCode() != 200) return -1;

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.body());

            int count = root.get("count").asInt();
            if (count == 0) return -1;

            JsonNode user = root.get("items").get(0);
            String handle = user.get("handle").asText();
            if (bojId.equals(handle)) {
                int tier = user.get("tier").asInt(); // 여전히 tier 반환은 유지
                log.debug("[BOJ ID 유효] handle: {}, tier: {}", handle, tier);
                return tier;
            }

        } catch (Exception e) {
            log.error("[BOJ ID 검증 중 예외 발생]", e);
        }

        return -1;
    }

    /** 2. 로그인 */
    public TokenPair login(LoginRequestDto loginRequestDto) {

        try {
            // 1. Spring Security 인증 수행
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getRecodeId(), loginRequestDto.getPassword())
            );

            // 2. 인증 성공 → CustomUserDetails 꺼내기
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser(); // 또는 getUsername 등 상황에 맞게

            // JWT 생성
            String accessToken = jwtTokenProvider.createAccessToken(user.getRecodeId());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getRecodeId());

            // 4. 결과 객체로 반환
            return new TokenPair(user, accessToken, refreshToken);

        } catch (UsernameNotFoundException e) {
            throw new BaseException(CommonErrorCode.LOGIN_USER_NOT_FOUND); // 입력한 사용자 ID로 유저를 찾을 수 없는 경우
        } catch (BadCredentialsException e) {
            throw new BaseException(CommonErrorCode.INVALID_PASSWORD);  // 비밀번호가 틀린 경우
        } catch (DisabledException e) {
            throw new BaseException(CommonErrorCode.USER_DISABLED); // 계정이 비활성화된 경우
        } catch (AuthenticationException e) {
            throw new BaseException(CommonErrorCode.AUTHENTICATION_FAILED); // 위의 세 가지를 제외한 Spring Security 인증 실패 전반
        }
    }

    /** 3. recodeId 중복 확인 */
    public boolean isRecodeIdDuplicated(String recodeId) {
        return userRepository.existsByRecodeId(recodeId);
    }

    /** 4. 닉네임 중복 확인 */
    public boolean isNicknameDuplicated(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    /** 5. 이메일 중복 확인 */
    public boolean isEmailDuplicated(String email) {
        return userRepository.existsByEmail(email);
    }

    /** 6. 닉네임 변경 */
    public void updateNickname(Long userId, String newNickname) {
        User user = findUserById(userId);
        user.updateNickname(newNickname);
    }

    /** 8. 비밀번호 변경 */
    public void updatePassword(Long userId, String currPassword, String newPassword) {
        User user = findUserById(userId);
        if (!user.getPassword().equals(currPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        user.updatePassword(newPassword);
    }

    /** 전체 회원 조회 */
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isDeleted()) // 탈퇴 회원 제외
                .map(UserResponseDto::new)
                .toList();
    }

    /** 특정 회원 조회 */
    public UserResponseDto getUserById(Long userId) {
        User user = findUserById(userId);
        return new UserResponseDto(user);
    }

    /** 회원 탈퇴 */
    public void deleteUser(Long userId) {
        User user = findUserById(userId);
        user.markAsDeleted();
        userRepository.save(user);
    }

    /** 유저 조회 공통 로직 */
    private User findUserById(Long userId) {
        return userRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않거나 탈퇴한 유저입니다."));
    }

    public boolean existsByBojId(String bojId) {
        return userRepository.existsByBojId(bojId);
    }

    /** 토큰 재발급 */
    public TokenPair reissueToken(String refreshToken) {

        // 클라이언트가 아예 refreshToken을 보내지 않았거나 빈 문자열로 보냈을 때
        if (!StringUtils.hasText(refreshToken)) {
            throw new BaseException(CommonErrorCode.NO_TOKEN_FOUND); // "요청에 리프레시 토큰이 포함되어 있지 않습니다."
        }

        // 토큰은 존재하지만 만료되었거나, 위조되었거나, 구조가 잘못된 경우
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BaseException(CommonErrorCode.INVALID_TOKEN); // "유효하지 않은 리프레시 토큰입니다."
        }

        String userId;
        try {
            // 토큰에서 userId를 파싱할 때 실패하는 경우 (e.g. 구조 이상, 시그니처 오류 등)
            userId = jwtTokenProvider.getUserId(refreshToken);
        } catch (Exception e) {
            throw new BaseException(CommonErrorCode.INVALID_TOKEN); // 동일하게 유효하지 않은 토큰으로 처리
        }

        UserDetails userDetails;
        try {
            // 토큰에서 꺼낸 userId로 DB에서 사용자 정보를 찾지 못한 경우
            userDetails = userDetailsService.loadUserByUsername(userId);
        } catch (UsernameNotFoundException e) {
            throw new BaseException(CommonErrorCode.TOKEN_USER_NOT_FOUND); // "사용자 정보를 찾을 수 없습니다."
        }

        // 인증된 사용자 정보에서 User 엔티티 추출 (주의: 캐스팅 실패 가능성은 거의 없지만 타입 보장 필요)
        User user = ((CustomUserDetails) userDetails).getUser();

        // 새 accessToken, refreshToken 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getRecodeId());
        String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getRecodeId());

        // 새로 발급된 토큰과 사용자 정보를 반환
        return new TokenPair(user, newAccessToken, newRefreshToken);
    }
}
