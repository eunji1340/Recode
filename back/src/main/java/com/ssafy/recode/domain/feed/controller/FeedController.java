package com.ssafy.recode.domain.feed.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.feed.dto.request.CommentRequest;
import com.ssafy.recode.domain.feed.dto.response.CommentResponseDto;
import com.ssafy.recode.domain.feed.dto.response.FeedResponseDto;
import com.ssafy.recode.domain.feed.service.FeedService;
import com.ssafy.recode.global.dto.response.ApiListPagingResponse;
import com.ssafy.recode.global.dto.response.ApiListResponse;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feeds")
@SecurityRequirement(name = "bearer-key")
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
    public ResponseEntity<Long> addLike(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable Long noteId) {
        Long userId = userDetails.getUser().getUserId();
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
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CommentRequest request) {

        Long userId = userDetails.getUser().getUserId();
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

    // 댓글 수정 -> 200 ok는 나오는데 content 이상하게 null로 나와요!!
    @PatchMapping("/{noteId}/comments/{commentId}")
    public ResponseEntity<ApiSingleResponse<CommentResponseDto>> updateComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                               @PathVariable Long noteId,
                                                                               @PathVariable Long commentId,
                                                                               @RequestBody CommentRequest request) throws AccessDeniedException {
        Long userId = userDetails.getUser().getUserId();
        CommentResponseDto response = feedService.updateComment(userId, commentId, request.getContent());
        return ResponseEntity.ok(ApiSingleResponse.from(response));
    }

    // 댓글 삭제
    @DeleteMapping("/{noteId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable Long noteId,
                                              @PathVariable Long commentId) throws AccessDeniedException {
        Long userId = userDetails.getUser().getUserId();
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
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {

        Long userId = userDetails.getUser().getUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedResponseDto> feeds = feedService.getFeedsOfFollowings(userId,tag, search, pageable);

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }

}
