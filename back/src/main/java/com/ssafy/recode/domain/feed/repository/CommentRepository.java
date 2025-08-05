package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    int countByFeed_NoteId(Long noteId);
    List<Comment> findAllByFeed_NoteId(Long noteId);
    List<Comment> findAllByUser_UserId(Long userId);
}