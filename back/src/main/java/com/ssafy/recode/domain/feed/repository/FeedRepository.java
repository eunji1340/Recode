package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Feed;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {
    // Feed
    List<Feed> findByUserIn(List<User> users, Pageable pageable);
}
