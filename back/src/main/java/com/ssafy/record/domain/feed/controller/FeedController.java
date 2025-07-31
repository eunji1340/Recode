//package com.ssafy.record.domain.feed.controller;
//
//import com.ssafy.record.domain.feed.dto.response.CommentResponseDto;
//import com.ssafy.record.domain.feed.service.FeedService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/feeds")
//@RequiredArgsConstructor
//public class FeedController {
//
//    private final FeedService feedService;
//
//    // 좋아요 수 조회
//    @GetMapping("/{noteId}/hearts")
//    public ResponseEntity<Integer> getLikeCount(@PathVariable Long noteId) {
//        int likeCount = feedService.getLikeCount(noteId);
//        return ResponseEntity.ok(likeCount);
//    }
//
//    // 좋아요 추가
//    @PostMapping("/{noteId}/hearts")
//    public ResponseEntity<Long> addLike(@RequestHeader("userId") Long userId,
//                                        @PathVariable Long noteId) {
//        Long likeId = feedService.addLike(userId, noteId);
//        return ResponseEntity.ok(likeId);
//    }
//
//    // 좋아요 삭제
//    @DeleteMapping("/{noteId}/hearts/{likeId}")
//    public ResponseEntity<Void> removeLike(@PathVariable Long noteId,
//                                           @PathVariable Long likeId) {
//        feedService.removeLike(likeId);
//        return ResponseEntity.ok().build();
//    }
//
//    // 댓글 생성
//    @PostMapping("/{noteId}/comments")
//    public ResponseEntity<Long> createComment(@RequestHeader("userId") Long userId,
//                                              @PathVariable Long noteId,
//                                              @RequestBody String content) {
//        Long commentId = feedService.createComment(userId, noteId, content);
//        return ResponseEntity.ok(commentId);
//    }
//
//    // 댓글 조회
//    @GetMapping("/{noteId}/comments")
//    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long noteId) {
//        List<CommentResponseDto> comments = feedService.getComments(noteId);
//        return ResponseEntity.ok(comments);
//    }
//
//    // 댓글 수정
//    @PutMapping("/{noteId}/comments/{commentId}")
//    public ResponseEntity<Void> updateComment(@RequestHeader("userId") Long userId,
//                                              @PathVariable Long noteId,
//                                              @PathVariable Long commentId,
//                                              @RequestBody String content) {
//        feedService.updateComment(userId, commentId, content);
//        return ResponseEntity.ok().build();
//    }
//
//    // 댓글 삭제
//    @DeleteMapping("/{noteId}/comments/{commentId}")
//    public ResponseEntity<Void> deleteComment(@RequestHeader("userId") Long userId,
//                                              @PathVariable Long noteId,
//                                              @PathVariable Long commentId) {
//        feedService.deleteComment(userId, commentId);
//        return ResponseEntity.ok().build();
//    }
//
//}
