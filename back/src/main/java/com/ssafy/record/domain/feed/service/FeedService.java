//package com.ssafy.record.domain.feed.service;
//
//import com.ssafy.record.domain.feed.dto.response.CommentResponseDto;
//import com.ssafy.record.domain.feed.entity.Like;
//import com.ssafy.record.domain.feed.repository.FeedRepository;
//import com.ssafy.record.domain.note.entity.Note;
//import com.ssafy.record.domain.user.entity.User;
//import com.ssafy.record.domain.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.nio.file.AccessDeniedException;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class FeedService {
//    private final UserRepository userRepository;
//    private final FeedRepository feedRepository;
//
//    /** 좋아요 수 조회 */
//    public int getLikeCount(Long noteId) {
//        return feedRepository.countByNoteNoteId(noteId);
//    }
//
//    /** 좋아요 추가 */
//    public Long addLike(Long userId, Long noteId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        Note note = feedRepository.findById(noteId)
//                .orElseThrow(() -> new RuntimeException("Note not found"));
//
//        Like like = Like.builder()
//                .user(user)
//                .note(note)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        return feedRepository.save(like).getLikeId();
//    }
//
//    /** 좋아요 삭제 */
//    public void removeLike(Long likeId) {
//        feedRepository.deleteById(likeId);
//    }
//
//    public Long createComment(Long userId, Long noteId, String content) {
//        User user = userRepository.findById(userId).orElseThrow();
//        Note note = noteRepository.findById(noteId).orElseThrow();
//
//        Comment comment = Comment.builder()
//                .user(user)
//                .note(note)
//                .content(content)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        return commentRepository.save(comment).getCommentId();
//    }
//
//    public List<CommentResponseDto> getComments(Long noteId) {
//        return commentRepository.findByNoteId(noteId).stream()
//                .map(comment -> CommentResponseDto.builder()
//                        .commentId(comment.getCommentId())
//                        .userId(comment.getUser().getUserId())
//                        .nickname(comment.getUser().getNickname())
//                        .content(comment.getContent())
//                        .createdAt(comment.getCreatedAt().toString())
//                        .build())
//                .collect(Collectors.toList());
//    }
//
//    public void updateComment(Long userId, Long commentId, String content) {
//        Comment comment = commentRepository.findById(commentId).orElseThrow();
//        if (!comment.getUser().getUserId().equals(userId)) throw new AccessDeniedException("권한 없음");
//        comment.setContent(content);
//    }
//
//    public void deleteComment(Long userId, Long commentId) {
//        Comment comment = commentRepository.findById(commentId).orElseThrow();
//        if (!comment.getUser().getUserId().equals(userId)) throw new AccessDeniedException("권한 없음");
//        commentRepository.delete(comment);
//    }
//
//}
