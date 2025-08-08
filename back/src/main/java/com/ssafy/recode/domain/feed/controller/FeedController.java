package com.ssafy.recode.domain.feed.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.feed.dto.request.CommentRequest;
import com.ssafy.recode.domain.feed.dto.response.CommentResponseDto;
import com.ssafy.recode.domain.feed.dto.response.FeedResponseDto;
import com.ssafy.recode.domain.feed.service.FeedService;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.service.UserService;
import com.ssafy.recode.global.dto.response.ApiListPagingResponse;
import com.ssafy.recode.global.dto.response.ApiListResponse;
import com.ssafy.recode.global.dto.response.ApiSingleResponse;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserService userService;

    // 좋아요 수 조회
    @GetMapping("/{noteId}/hearts")
    @Operation(summary = "특정 노트의 좋아요 수 조회")
    public ResponseEntity<ApiSingleResponse<Map<String, Integer>>> getLikeCount(@PathVariable Long noteId) {
        int count = feedService.getLikeCount(noteId);
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(ApiSingleResponse.from(response));
    }

    // 좋아요 추가
    @PostMapping("/{noteId}/hearts")
    @Operation(summary = "특정 노트에 좋아요 추가")
    public ResponseEntity<Long> addLike(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable Long noteId) {
        User user = userDetails.getUser();
        Long likeId = feedService.addLike(user, noteId);
        return ResponseEntity.ok(likeId);
    }

    // 좋아요 삭제
    @DeleteMapping("/{noteId}/hearts")
    @Operation(summary = "특정 노트에 좋아요 삭제")
    public ResponseEntity<Void> removeLike(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @PathVariable Long noteId) {
        feedService.removeLike(userDetails.getUser(), noteId);
        return ResponseEntity.ok().build();
    }

    // 댓글 생성
    @PostMapping("/{noteId}/comments")
    @Operation(summary = "특정 노트에 댓글 생성")
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
    @Operation(summary = "특정 노트의 댓글 수 조회")
    public ResponseEntity<Integer> getCommentsCount(@PathVariable Long noteId) {
        int count = feedService.getCommentCount(noteId);
        return ResponseEntity.ok(count);
    }


    // 댓글 조회
    @GetMapping("/{noteId}/comments")
    @Operation(summary = "특정 노트의 전체 댓글 조회")
    public ResponseEntity<ApiListResponse<CommentResponseDto>> getComments(@PathVariable Long noteId) {
        List<CommentResponseDto> comments = feedService.getComments(noteId);
        return ResponseEntity.ok(ApiListResponse.from(comments));
    }

    // 댓글 수정
    @PutMapping("/{noteId}/comments/{commentId}")
    @Operation(summary = "특정 노트의 댓글 수정")
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
    @Operation(summary = "특정 노트의 댓글 삭제")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable Long noteId,
                                              @PathVariable Long commentId) throws AccessDeniedException {
        Long userId = userDetails.getUser().getUserId();
        feedService.deleteComment(userId, commentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "전체피드 조회 (태그/검색어)로 검색")
    public ResponseEntity<ApiListPagingResponse<FeedResponseDto>> getAllFeeds(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {

//        Long userId = userDetails.getUser().getUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedResponseDto> feeds = feedService.getAllFeeds(userDetails.getUser(), tag, search, pageable);

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }

    @GetMapping("/followings")
    @Operation(summary = "팔로우한 피드 조회 (태그/검색어)로 검색")
    public ResponseEntity<ApiListPagingResponse<FeedResponseDto>> getFeedsOfFollowings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {

//        Long userId = userDetails.getUser().getUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedResponseDto> feeds = feedService.getFeedsOfFollowings(userDetails.getUser(),tag, search, pageable);

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }

    // 특정 유저의 댓글 조회
    @GetMapping("/comments/{userId}")
    @Operation(summary = "특정 유저의 전체 댓글 조회")
    public ResponseEntity<ApiListResponse<CommentResponseDto>> getCommentsByUserId(@PathVariable Long userId) {
        List<CommentResponseDto> comments = feedService.getCommentsByUserId(userId);
        return ResponseEntity.ok(ApiListResponse.from(comments));
    }

    @Operation(summary = "사용자가 좋아요한 노트 목록 조회", description = "userId가 좋아요한 노트들을 페이지네이션으로 조회합니다.")
    @GetMapping("/{userId}/liked-notes")
    public ResponseEntity<Map<String, Object>> getLikedNotesByUserId(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        NoteResponseWrapper response = feedService.getLikedNotesByUserId(userId, page, size);
        Map<String, Object> body = Map.of("data", response);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "userId로 노트 검색", description = "userId로 노트를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<ApiListPagingResponse<FeedResponseDto>> getNotesByUserId(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {

//        Long userId = userDetails.getUser().getUserId();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FeedResponseDto> feeds = feedService.getAllFeedsByUserId(userId, tag, search, pageable);

        return ResponseEntity.ok(ApiListPagingResponse.from(
                feeds.getContent(),
                feeds.getTotalElements(),
                feeds.getTotalPages(),
                feeds.isLast()
        ));
    }
}
