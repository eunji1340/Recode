//package com.ssafy.record.domain.feed.repository;
//
//import com.ssafy.record.domain.feed.entity.Like;
//import com.ssafy.record.domain.note.entity.Note;
//import com.ssafy.record.domain.user.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface FeedRepository extends JpaRepository<Like, Long> {
//    // Feed
//    // Comment
//    // Like
//    List<Like> findByNote(Long noteId);
//    Optional<Like> findByNoteAndUser(Note note, User user);
//}
