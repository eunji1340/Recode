package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    int countByFeed_NoteId(Long noteId);
    List<Comment> findAllByFeed_NoteId(Long noteId);
    List<Comment> findAllByUser_UserId(Long userId);
    @EntityGraph(attributePaths = {"feed", "feed.user"})
    Page<Comment> findByUser_UserId(Long userId, Pageable pageable);
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.commentId = :commentId AND c.user.userId = :userId")
    int deleteByIdAndUserId(@Param("commentId") Long commentId, @Param("userId") Long userId);
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.feed.noteId = :noteId")
    void deleteByNoteId(@Param("noteId") Long noteId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.user.userId = :userId")
    void deleteCommentsByUserId(@Param("userId") Long userId);
}