package com.ssafy.recode.domain.follow.repository;

import com.ssafy.recode.domain.follow.entity.Follow;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(User follower, User following);

    void deleteByFollowerAndFollowing(User follower, User following);

    @Modifying
    @Query("DELETE FROM Follow f WHERE f.follower.userId = :userId OR f.following.userId = :userId")
    void deleteFollowsByUserId(@Param("userId") Long userId);

    // 날 팔로우하는 사람들
    List<Follow> findByFollower(User follower);
    // 내가 팔로우중인 사람들
    List<Follow> findByFollowing(User following);

    @Query("""
select f.following.userId
from Follow f
where f.follower.userId = :viewerId
  and f.following.userId in :ownerIds
""")
    Set<Long> findFollowingUserIds(@Param("viewerId") Long viewerId,
                                   @Param("ownerIds") Collection<Long> ownerIds);
}
