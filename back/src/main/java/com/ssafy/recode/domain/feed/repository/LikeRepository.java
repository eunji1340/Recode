package com.ssafy.recode.domain.feed.repository;

import com.ssafy.recode.domain.feed.entity.Like;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface LikeRepository extends JpaRepository<Like, Long> {
    int countByNote_NoteId(Long noteId);
    List<Like> findAllByNote_NoteId(Long noteId);
    Optional<Like> findByUserAndNote(User user, Note feed);

    Page<Like> findAllByUser_UserId(Long userId, Pageable pageable);

    boolean existsByUserAndNote(User user, Note note);

    @Query("""
        select l.note.noteId
        from Like l
        where l.user.userId = :viewerId
          and l.note.noteId in :noteIds
    """)
    Set<Long> findLikedNoteIds(@Param("viewerId") Long viewerId,
                               @Param("noteIds") Collection<Long> noteIds);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.user = :user AND l.note.noteId = :noteId")
    void deleteByUserAndNoteId(@Param("user") User user, @Param("noteId") Long noteId);
    @Modifying
    @Query("DELETE FROM Like l WHERE l.note.noteId = :noteId")
    void deleteByNoteId(@Param("noteId") Long noteId);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.user.userId = :userId")
    void deleteLikesByUserId(@Param("userId") Long userId);
}