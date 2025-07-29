package com.ssafy.record.domain.feed.repository;

import com.ssafy.record.domain.feed.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByFeed_NoteId(Long noteId);
}
