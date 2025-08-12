package com.ssafy.recode.domain.follow.repository;

import com.ssafy.recode.domain.follow.entity.Follow;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(User follower, User following);

    void deleteByFollowerAndFollowing(User follower, User following);

    // 날 팔로우하는 사람들
    List<Follow> findByFollower(User follower);
    // 내가 팔로우중인 사람들
    List<Follow> findByFollowing(User following);
}
