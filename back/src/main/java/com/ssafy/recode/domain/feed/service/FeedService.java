package com.ssafy.recode.domain.feed.service;

import com.ssafy.recode.domain.feed.dto.response.*;
import com.ssafy.recode.domain.feed.entity.Comment;
import com.ssafy.recode.domain.feed.entity.Like;
import com.ssafy.recode.domain.feed.entity.ProblemEntity;
import com.ssafy.recode.domain.feed.repository.CommentRepository;
import com.ssafy.recode.domain.feed.repository.LikeRepository;
import com.ssafy.recode.domain.follow.entity.Follow;
import com.ssafy.recode.domain.follow.repository.FollowRepository;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.repository.NoteRepository;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
//    private final FeedRepository feedRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final NoteRepository noteRepository;

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
        Note feed = noteRepository.findById(noteId)
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
        Note feed = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Feed not found"));

        LocalDateTime now = LocalDateTime.now();

        Comment comment = Comment.builder()
                .user(user)
                .feed(feed)
                .content(content)
                .createdAt(now)
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponseDto.from(saved);
    }

    /** 댓글 전체 조회 */
    public List<CommentResponseDto> getComments(Long noteId) {
        return commentRepository.findAllByFeed_NoteId(noteId).stream()
                .map(CommentResponseDto::from)
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
        comment.setUpdatedAt(LocalDateTime.now());

        return CommentResponseDto.from(comment);
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

    public Page<FeedResponseDto> getAllFeeds(Pageable pageable) {
        Page<Note> notes = noteRepository.findAllByIsPublicTrueAndIsDeletedFalse(pageable);

        return notes.map(note -> {
            int likeCount = likeRepository.countByFeed_NoteId(note.getNoteId());
            int commentCount = commentRepository.countByFeed_NoteId(note.getNoteId());

            User user = userRepository.findById(note.getUser().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            ProblemEntity problem = new ProblemEntity(note.getProblemId(), note.getProblemName(), note.getProblemTier());

            return FeedResponseDto.builder()
                    .noteId(note.getNoteId())
                    .noteTitle(note.getNoteTitle())
                    .isPublic(note.getIsPublic())
                    .createdAt(note.getCreatedAt().toString())
                    .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt().toString() : null)
                    .viewCount(note.getViewCount())
                    .likeCount(likeCount)
                    .commentCount(commentCount)
                    .user(UserDto.from(user))
                    .problem(ProblemDto.from(problem))
                    .tags(note.getTags().stream()
                            .map(TagDto::from)
                            .collect(Collectors.toList()))
                    .isDeleted(note.getIsDeleted())
                    .build();
        });
    }

    /** 팔로잉 피드 조회 */
    public Page<FeedResponseDto> getFeedsOfFollowings(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. 내가 팔로우하는 사람들 찾기
        List<Follow> followings = followRepository.findByFollowing(user);
        List<User> followingUsers = followings.stream()
                .map(Follow::getFollowing)
                .toList();

        if (followingUsers.isEmpty()) {
            return Page.empty(pageable);
        }

        // 2. 해당 유저들의 Note 목록 가져오기
        Page<Note> notesPage = noteRepository.findByUserInAndIsPublicTrue(followingUsers, pageable);

        // 3. Dto 변환
        List<FeedResponseDto> dtoList = notesPage.stream()
                .map(note -> {
                    int likeCount = likeRepository.countByFeed_NoteId(note.getNoteId());
                    int commentCount = commentRepository.countByFeed_NoteId(note.getNoteId());

                    ProblemEntity problem = new ProblemEntity(
                            note.getProblemId(),
                            note.getProblemName(),
                            note.getProblemTier()
                    );

                    return FeedResponseDto.builder()
                            .noteId(note.getNoteId())
                            .content(note.getContent())
                            .successCodeStart(note.getSuccessCodeStart())
                            .successCodeEnd(note.getSuccessCodeEnd())
                            .failCodeStart(note.getFailCodeStart())
                            .failCodeEnd(note.getFailCodeEnd())
                            .isPublic(note.getIsPublic())
                            .createdAt(note.getCreatedAt().toString())
                            .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt().toString() : null)
                            .viewCount(note.getViewCount())
                            .likeCount(likeCount)
                            .commentCount(commentCount)
                            .user(UserDto.from(note.getUser()))
                            .problem(ProblemDto.from(problem))
                            .tags(note.getTags().stream()
                                    .map(TagDto::from)
                                    .collect(Collectors.toList()))
                            .isDeleted(note.getIsDeleted())
                            .build();
                })
                .toList();

        return new PageImpl<>(dtoList, pageable, notesPage.getTotalElements());
    }
}
