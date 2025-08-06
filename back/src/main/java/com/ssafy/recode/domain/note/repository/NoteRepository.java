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
    Page<Note> findByUserInAndIsPublicTrue(List<User> users, Pageable pageable);
    // 전체 조회
    Page<Note> findAllByIsPublicTrueAndIsDeletedFalse(Pageable pageable);

    // 태그만
    Page<Note> findByTags_TagNameAndIsPublicTrueAndIsDeletedFalse(String tagName, Pageable pageable);

    // 검색어만 (noteTitle or noteId)
    @Query("SELECT n FROM Note n WHERE n.isPublic = true AND n.isDeleted = false AND " +
            "(LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR str(n.noteId) LIKE %:search%)")
    Page<Note> findByNoteTitleContainingIgnoreCaseOrNoteIdContainingAndIsPublicTrueAndIsDeletedFalse(@Param("search") String title, @Param("search") String noteId, Pageable pageable);

    // 태그 + 검색어
    @Query("SELECT DISTINCT n FROM Note n JOIN n.tags t WHERE n.isPublic = true AND n.isDeleted = false " +
            "AND t.tagName = :tag " +
            "AND (LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR str(n.noteId) LIKE %:search%)")
    Page<Note> findByTags_TagNameAndNoteTitleContainingIgnoreCaseOrNoteIdContainingAndIsPublicTrueAndIsDeletedFalse(
            @Param("tag") String tag,
            @Param("search") String title,
            @Param("search") String noteId,
            Pageable pageable);


}

