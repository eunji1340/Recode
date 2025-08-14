package com.ssafy.recode.domain.follow.service;

import com.ssafy.recode.domain.follow.dto.response.FollowResponseDto;
import com.ssafy.recode.domain.follow.entity.Follow;
import com.ssafy.recode.domain.follow.repository.FollowRepository;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Transactional
    public void follow(Long userId, Long followId) {
        if (userId.equals(followId)) throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");

        User follower = getUser(userId);
        User following = getUser(followId);

        if (followRepository.existsByFollowerAndFollowing(follower, following)) return;

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();
        followRepository.save(follow);
    }

    @Transactional
    public void unfollow(Long userId, Long followId) {
        User follower = getUser(userId);
        User following = getUser(followId);

        followRepository.deleteByFollowerAndFollowing(follower, following);
    }

    @Transactional(readOnly = true)
    public List<FollowResponseDto> getFollowers(Long userId) {
        User user = getUser(userId);
        return followRepository.findByFollowing(user).stream()
                .map(f -> new FollowResponseDto(f.getFollower()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FollowResponseDto> getFollowings(Long userId) {
        User user = getUser(userId);
        return followRepository.findByFollower(user).stream()
                .map(f -> new FollowResponseDto(f.getFollowing()))
                .toList();
    }

    private User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("사용자 없음"));
    }
}
