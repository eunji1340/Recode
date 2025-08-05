package com.ssafy.record.domain.user.service;

import com.ssafy.record.domain.user.dto.request.UserRequestDto;
import com.ssafy.record.domain.user.dto.response.UserResponseDto;
import com.ssafy.record.domain.user.entity.User;
import com.ssafy.record.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /** 1. 회원가입 */
    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = userRepository.save(dto.toEntity());
        return new UserResponseDto(user);
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

    /** 7. 프로필 이미지 변경 */
    public void updateProfileImage(Long userId, String imageUrl) {
        User user = findUserById(userId);
        user.updateProfileImg(imageUrl);
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
