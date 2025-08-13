package com.ssafy.recode.domain.note.repository;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
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
    List<Note> findAllByNoteIdIn(Collection<Long> noteIds);

    @Modifying
    @Query("DELETE FROM Note n WHERE n.user.userId = :userId")
    void deleteNotesByUserId(@Param("userId") Long userId);

    // 전체 조회
    Page<Note> findAllByIsPublicTrueAndIsDeletedFalse(Pageable pageable);

    // 태그만
    Page<Note> findByTags_TagNameContainingIgnoreCaseAndIsPublicTrueAndIsDeletedFalse(
            String tagName, Pageable pageable);

    // 검색어만 (noteTitle or noteId)
    @Query("""
    SELECT n FROM Note n
    WHERE n.isPublic = true AND n.isDeleted = false AND (
        LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        CAST(n.problemId AS string) LIKE %:search% OR
        LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
    )
""")
    Page<Note> searchNotesOnly(@Param("search") String search, Pageable pageable);



    // 태그 + 검색어
    @Query("""
    SELECT DISTINCT n FROM Note n
    JOIN n.tags t
    WHERE n.isPublic = true AND n.isDeleted = false AND
        LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%')) AND (
        LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        CAST(n.problemId AS string) LIKE %:search% OR
        LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
    )
""")
    Page<Note> searchNotesByTagAndKeyword(@Param("tag") String tag, @Param("search") String search, Pageable pageable);

    // 태그 + 검색어 + 작성자
    @Query("""
SELECT DISTINCT n FROM Note n
JOIN n.tags t
WHERE n.isPublic = true AND n.isDeleted = false
AND LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%')) AND (
    LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR
    LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
    CAST(n.problemId AS string) LIKE %:search% OR
    LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
)
""")
    Page<Note> searchNotesOfUsersByTagAndKeyword(@Param("users") List<User> users,
                                                 @Param("tag") String tag,
                                                 @Param("search") String search,
                                                 Pageable pageable);

    // 검색어만 + 작성자
    @Query("""
SELECT n FROM Note n
WHERE n.isPublic = true AND n.isDeleted = false
AND LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%')) AND (
    LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR
    LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
    CAST(n.problemId AS string) LIKE %:search% OR
    LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
)
""")
    Page<Note> searchNotesOfUsersByKeyword(@Param("users") List<User> users,
                                           @Param("search") String search,
                                           Pageable pageable);

    // 태그만 + 작성자
    @Query("""
SELECT DISTINCT n FROM Note n
JOIN n.tags t
WHERE n.isPublic = true AND n.isDeleted = false
AND LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%')) AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%'))
""")
    Page<Note> searchNotesOfUsersByTag(@Param("users") List<User> users,
                                       @Param("tag") String tag,
                                       Pageable pageable);

    // 아무 조건 없음 (기존)
    Page<Note> findByUserInAndIsPublicTrueAndIsDeletedFalse(List<User> users, Pageable pageable);

    List<Note> findByUser_UserId(Long userId);

    @Query("SELECT n FROM Note n JOIN FETCH n.tags WHERE n.user.userId = :userId AND n.isDeleted = false")
    List<Note> findAllByUserIdWithTags(@Param("userId") Long userId);

    // 30일 이전까지 노트 가져오는 쿼리
    List<Note> findByUser_UserIdAndCreatedAtAfter(Long userId, LocalDateTime thirtyDaysAgo);

    @Query("SELECT n.createdAt FROM Note n WHERE n.user.userId = :userId")
    List<LocalDateTime> findAllNoteDateTimesByUserId(@Param("userId") Long userId);

    Page<Note> findAllByUser_UserId(long userId, Pageable pageable);

    List<Note> findByUserUserIdAndIsDeletedFalse(Long userId);

    // 특정 유저 + 전체(공개 & 삭제안됨)
    Page<Note> findByUser_UserIdAndIsPublicTrueAndIsDeletedFalse(Long userId, Pageable pageable);

    // 특정 유저 + 태그만
    @Query("""
SELECT DISTINCT n FROM Note n
JOIN n.tags t
WHERE n.isPublic = true AND n.isDeleted = false
  AND n.user.userId = :userId
  AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%'))
""")
    Page<Note> findByUserAndTag(@Param("userId") Long userId,
                                @Param("tag") String tag,
                                Pageable pageable);

    // 특정 유저 + 검색어만
    @Query("""
SELECT n FROM Note n
WHERE n.isPublic = true AND n.isDeleted = false
  AND n.user.userId = :userId
  AND (
    LOWER(n.noteTitle)   LIKE LOWER(CONCAT('%', :search, '%')) OR
    LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
    CAST(n.problemId AS string) LIKE %:search% OR
    LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
  )
""")
    Page<Note> searchUserNotesOnly(@Param("userId") Long userId,
                                   @Param("search") String search,
                                   Pageable pageable);

    // 특정 유저 + 태그 + 검색어
    @Query("""
SELECT DISTINCT n FROM Note n
JOIN n.tags t
WHERE n.isPublic = true AND n.isDeleted = false
  AND n.user.userId = :userId
  AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%'))
  AND (
    LOWER(n.noteTitle)   LIKE LOWER(CONCAT('%', :search, '%')) OR
    LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
    CAST(n.problemId AS string) LIKE %:search% OR
    LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
  )
""")
    Page<Note> searchUserNotesByTagAndKeyword(@Param("userId") Long userId,
                                              @Param("tag") String tag,
                                              @Param("search") String search,
                                              Pageable pageable);
    // 특정 유저 전체 (비공개 포함: viewer==owner일 때 통과)
    @Query("""
    SELECT n FROM Note n
    WHERE n.user.userId = :userId
      AND n.isDeleted = false
      AND (n.isPublic = true OR :viewerId = :userId)
    """)
    Page<Note> findByUserIncludePrivate(@Param("viewerId") Long viewerId,
                                        @Param("userId") Long userId,
                                        Pageable pageable);

    // 특정 유저 + 태그만 (비공개 포함)
    @Query("""
    SELECT DISTINCT n FROM Note n
    JOIN n.tags t
    WHERE n.user.userId = :userId
      AND n.isDeleted = false
      AND (n.isPublic = true OR :viewerId = :userId)
      AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%'))
    """)
    Page<Note> findByUserAndTagIncludePrivate(@Param("viewerId") Long viewerId,
                                              @Param("userId") Long userId,
                                              @Param("tag") String tag,
                                              Pageable pageable);

    // 특정 유저 + 검색어만 (비공개 포함)
    @Query("""
    SELECT n FROM Note n
    WHERE n.user.userId = :userId
      AND n.isDeleted = false
      AND (n.isPublic = true OR :viewerId = :userId)
      AND (
        LOWER(n.noteTitle)   LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        CAST(n.problemId AS string) LIKE %:search% OR
        LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
      )
    """)
    Page<Note> searchUserNotesOnlyIncludePrivate(@Param("viewerId") Long viewerId,
                                                 @Param("userId") Long userId,
                                                 @Param("search") String search,
                                                 Pageable pageable);

    // 특정 유저 + 태그 + 검색어 (비공개 포함)
    @Query("""
    SELECT DISTINCT n FROM Note n
    JOIN n.tags t
    WHERE n.user.userId = :userId
      AND n.isDeleted = false
      AND (n.isPublic = true OR :viewerId = :userId)
      AND LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%'))
      AND (
        LOWER(n.noteTitle)   LIKE LOWER(CONCAT('%', :search, '%')) OR
        LOWER(n.problemName) LIKE LOWER(CONCAT('%', :search, '%')) OR
        CAST(n.problemId AS string) LIKE %:search% OR
        LOWER(n.user.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
      )
    """)
    Page<Note> searchUserNotesByTagAndKeywordIncludePrivate(@Param("viewerId") Long viewerId,
                                                            @Param("userId") Long userId,
                                                            @Param("tag") String tag,
                                                            @Param("search") String search, Pageable pageable);
}


