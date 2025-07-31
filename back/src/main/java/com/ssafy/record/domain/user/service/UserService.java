package com.ssafy.record.domain.user.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.record.domain.user.dto.request.UserRequestDto;
import com.ssafy.record.domain.user.dto.response.UserResponseDto;
import com.ssafy.record.domain.user.entity.User;
import com.ssafy.record.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    final Logger log = LoggerFactory.getLogger(UserService.class);

    /** 1. 회원가입 */
    public UserResponseDto register(UserRequestDto dto) {
        log.info("[회원가입 요청] 사용자명: {}, 백준 ID: {}", dto.getRecordId(), dto.getBojId());

        int tier = fetchBojTier(dto.getBojId());
        if (tier == 0) {
            log.warn("[백준 ID 확인 실패] 존재하지 않는 ID: {}", dto.getBojId());
            throw new IllegalArgumentException("유효하지 않은 백준 ID입니다.");
        }
        dto.setTier(tier);

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        log.info("[백준 ID 확인 성공] 등록 가능한 ID: {}, 티어: {}", dto.getBojId(), tier);

        User user = userRepository.save(dto.toEntity());
        log.info("[회원가입 성공] 사용자명: {}, 백준 ID: {}", user.getRecordId(), user.getBojId());

        return new UserResponseDto(user);
    }

    /** BOJ ID 유효성 및 티어 조회 */
    private int fetchBojTier(String bojId) {
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

            if (response.statusCode() != 200) return 0;

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode items = objectMapper.readTree(response.body()).get("items");

            if (items != null && items.size() > 0) {
                JsonNode user = items.get(0);
                String handle = user.get("handle").asText();
                if (bojId.equals(handle)) {
                    int tier = user.get("tier").asInt();
                    log.debug("[BOJ ID 유효] handle: {}, tier: {}", handle, tier);
                    return tier;
                }
            }
        } catch (Exception e) {
            log.error("[BOJ ID 검증 중 예외 발생]", e);
        }

        return 0;
    }

    /** 2. 로그인 */
    public UserResponseDto login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(EntityNotFoundException::new);

        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        return new UserResponseDto(user);
    }

    /** 3. recordId 중복 확인 */
    public boolean isRecordIdDuplicated(String recordId) {
        return userRepository.existsByRecordId(recordId);
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
        if (user.getPassword().equals(currPassword)) user.updatePassword(newPassword);
    }

    /** 🔍 공통 유저 조회 */
    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);
    }
}
