package com.ssafy.recode.domain.feed.service;

import com.ssafy.recode.domain.feed.dto.response.CommentResponseDto;
import com.ssafy.recode.domain.feed.entity.Comment;
import com.ssafy.recode.domain.feed.entity.Feed;
import com.ssafy.recode.domain.feed.entity.Like;
import com.ssafy.recode.domain.feed.repository.CommentRepository;
import com.ssafy.recode.domain.feed.repository.FeedRepository;
import com.ssafy.recode.domain.feed.repository.LikeRepository;
import com.ssafy.recode.domain.follow.repository.FollowRepository;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final UserRepository userRepository;
    private final FeedRepository feedRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;

    /** 좋아요 수 조회 */
    public int getLikeCount(Long noteId) {
        return likeRepository.countByFeed_NoteId(noteId);
    }

    /** 댓글 수 조회 */
    public int getCommentCount(Long noteId) {
        return commentRepository.countByFeed_NoteId(noteId);
    }

    /** 좋아요 추가 */
    public Long addLike(Long userId, Long noteId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Feed feed = feedRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Feed not found"));

        Like like = Like.builder()
                .user(user)
                .feed(feed)
                .build();

        return likeRepository.save(like).getLikeId();
    }

    /** 좋아요 삭제 */
    @Transactional
    public void removeLike(Long likeId) {
        System.out.println("[삭제 요청] likeId: " + likeId); // 로그
        likeRepository.deleteById(likeId);
    }

    /** 댓글 생성 */
    public CommentResponseDto createComment(Long userId, Long noteId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Feed feed = feedRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Feed not found"));

        LocalDateTime now = LocalDateTime.now();

        Comment comment = Comment.builder()
                .user(user)
                .feed(feed)
                .content(content)
                .createdAt(now)
                .build();

        Comment saved = commentRepository.save(comment);

        return CommentResponseDto.builder()
                .commentId(saved.getCommentId())
                .userId(user.getUserId())
                .noteId(feed.getNoteId())
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt().toString())
                .build();
    }

    /** 댓글 전체 조회 */
    public List<CommentResponseDto> getComments(Long noteId) {
        return commentRepository.findAllByFeed_NoteId(noteId).stream()
                .map(comment -> CommentResponseDto.builder()
                        .commentId(comment.getCommentId())
                        .userId(comment.getUser().getUserId())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }

    /** 댓글 수정 */
    @Transactional
    public CommentResponseDto updateComment(Long userId, Long commentId, String content) throws AccessDeniedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("권한 없음");
        }
        comment.setContent(content);
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .userId(comment.getUser().getUserId())
                .noteId(comment.getFeed().getNoteId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().toString())
                .build();
    }


    /** 댓글 삭제 */
    public void deleteComment(Long userId, Long commentId) throws AccessDeniedException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("권한 없음");
        }
        commentRepository.delete(comment);
    }

    /** 피드 조회 */
//    public FeedListResponse getFeedsOfFollowings(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // 1. 팔로우한 유저 목록
//        List<User> followings = followRepository.findByFollowing(user.getUserId());
//
//        // 2. 해당 유저들의 피드 조회
//        List<Feed> feeds = feedRepository.findAllByUserIn(followings);
//
//        List<FeedResponseDto> feedDtos = feeds.stream().map(feed -> {
//            return FeedResponseDto.builder()
//                    .noteId(feed.getNoteId())
//                    .content(feed.getContent())
//                    .successCodeStart(feed.getSuccessCodeStart())
//                    .successCodeEnd(feed.getSuccessCodeEnd())
//                    .failCodeStart(feed.getFailCodeStart())
//                    .failCodeEnd(feed.getFailCodeEnd())
//                    .isPublic(feed.getIsPublic())
//                    .createdAt(feed.getCreatedAt().toString())
//                    .updatedAt(feed.getUpdatedAt().toString())
//                    .viewCount(feed.getViewCount())
//                    .likeCount(likeRepository.countByFeed_NoteId(feed.getNoteId()))
//                    .commentCount(commentRepository.countByFeed_NoteId(feed.getNoteId()))
//                    .user(UserDto.builder()
//                            .userId(feed.getUser().getUserId())
//                            .bojId(feed.getUser().getBojId())
//                            .nickname(feed.getUser().getNickname())
//                            .userTier(feed.getUser().getTier())
//                            .build())
//                    .problem(ProblemDto.builder()
//                            .problemId(feed.getProblem().getProblemId())
//                            .problemName(feed.getProblem().getProblemName())
//                            .tier(feed.getProblem().getTier())
//                            .build())
//                    .tags(Arrays.asList(feed.getTags().split(",")))
//                    .isDeleted(feed.getIsDeleted())
//                    .build();
//        }).collect(Collectors.toList());
//
//        return FeedListResponse.builder().details(feedDtos).build();
//    }

}
