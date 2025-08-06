package com.ssafy.recode.domain.feed.controller;

import com.ssafy.recode.domain.feed.dto.request.CommentRequest;
import com.ssafy.recode.domain.feed.dto.response.CommentResponseDto;
import com.ssafy.recode.domain.feed.dto.response.FeedResponseDto;
import com.ssafy.recode.domain.feed.service.FeedService;
import com.ssafy.recode.global.dto.response.ApiListPagingResponse;
import com.ssafy.recode.global.dto.response.ApiListResponse;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    // 좋아요 수 조회
    @GetMapping("/{noteId}/hearts")
    public ResponseEntity<ApiSingleResponse<Map<String, Integer>>> getLikeCount(@PathVariable Long noteId) {
        int count = feedService.getLikeCount(noteId);
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(ApiSingleResponse.from(response));
    }

    // 좋아요 추가
    @PostMapping("/{noteId}/hearts")
    public ResponseEntity<Long> addLike(@RequestHeader("userId") Long userId,
                                        @PathVariable Long noteId) {
        Long likeId = feedService.addLike(userId, noteId);
        return ResponseEntity.ok(likeId);
    }

    // 좋아요 삭제
    @DeleteMapping("/{noteId}/hearts/{likeId}")
    public ResponseEntity<Void> removeLike(@PathVariable Long noteId,
                                           @PathVariable Long likeId) {
        feedService.removeLike(likeId);
        return ResponseEntity.ok().build();
    }

    // 댓글 생성
    @PostMapping("/{noteId}/comments")
    public ResponseEntity<ApiSingleResponse<CommentResponseDto>> createComment(
            @PathVariable Long noteId,
            @RequestHeader("userId") Long userId,
            @RequestBody CommentRequest request) {

        CommentResponseDto comment = feedService.createComment(userId, noteId, request.getContent());
        return ResponseEntity.ok(ApiSingleResponse.from(comment));
    }


    // 댓글 수 조회
    @GetMapping("/{noteId}/comments_count")
    public ResponseEntity<Integer> getCommentsCount(@PathVariable Long noteId) {
        int count = feedService.getCommentCount(noteId);
        return ResponseEntity.ok(count);
    }


    // 댓글 조회
    @GetMapping("/{noteId}/comments")
    public ResponseEntity<ApiListResponse<CommentResponseDto>> getComments(@PathVariable Long noteId) {
        List<CommentResponseDto> comments = feedService.getComments(noteId);
        return ResponseEntity.ok(ApiListResponse.from(comments));
    }

    // 댓글 수정
    @PatchMapping("/{noteId}/comments/{commentId}")
    public ResponseEntity<ApiSingleResponse<CommentResponseDto>> updateComment(@RequestHeader("userId") Long userId,
                                                                               @PathVariable Long noteId,
                                                                               @PathVariable Long commentId,
                                                                               @RequestBody CommentRequest request) throws AccessDeniedException {
        CommentResponseDto response = feedService.updateComment(userId, commentId, request.getContent());
        return ResponseEntity.ok(ApiSingleResponse.from(response));
    }

    // 댓글 삭제
    @DeleteMapping("/{noteId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@RequestHeader("userId") Long userId,
                                              @PathVariable Long noteId,
                                              @PathVariable Long commentId) throws AccessDeniedException {
        feedService.deleteComment(userId, commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<ApiListPagingResponse<FeedResponseDto>> getAllFeeds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedResponseDto> feeds = feedService.getAllFeeds(tag, search, pageable);

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }


    @GetMapping("/followings")
    public ResponseEntity<ApiListPagingResponse<FeedResponseDto>> getFeedsOfFollowings(
            @RequestParam Long userId, // 내가 팔로잉하는 사람의 userId
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<FeedResponseDto> feeds = feedService.getFeedsOfFollowings(userId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }

}
