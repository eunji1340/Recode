package com.ssafy.recode.domain.note.repository;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query("SELECT n FROM Note n WHERE " +
            "LOWER(n.problemName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Note> searchByQuery(@Param("query") String query);

    Optional<Note> findByNoteIdAndIsDeletedFalse(Long noteId);
    Page<Note> findByUserIn(List<User> users, Pageable pageable);
}

