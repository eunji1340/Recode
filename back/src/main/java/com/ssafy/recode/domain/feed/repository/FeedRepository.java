//package com.ssafy.recode.domain.feed.repository;
//
//import com.ssafy.recode.domain.feed.entity.Like;
//import com.ssafy.recode.domain.note.entity.Note;
//import com.ssafy.recode.domain.user.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface FeedRepository extends JpaRepository<Like, Long> {
//    // Feed
//    // Comment
//    // Like
//    List<Like> findByNoteId(Long noteId);
//    Optional<Like> findByNoteAndUser(Note note, User user);
//}
