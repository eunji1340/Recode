package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Like;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    int countByNote_NoteId(Long noteId);
    List<Like> findAllByNote_NoteId(Long noteId);
    Optional<Like> findByUserAndNote(User user, Note feed);
}