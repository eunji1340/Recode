package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {
    int countByFeed_NoteId(Long noteId);
    List<Like> findAllByFeed_NoteId(Long noteId);
}