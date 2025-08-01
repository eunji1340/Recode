package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedRepository extends JpaRepository<Feed, Long> {
    // Feed
}
