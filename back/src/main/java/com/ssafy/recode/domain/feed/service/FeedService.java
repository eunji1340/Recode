package com.ssafy.recode.domain.feed.service;

import com.ssafy.recode.domain.feed.dto.response.*;
import com.ssafy.recode.domain.feed.entity.Comment;
import com.ssafy.recode.domain.feed.entity.Like;
import com.ssafy.recode.domain.feed.entity.ProblemEntity;
import com.ssafy.recode.domain.feed.repository.CommentRepository;
import com.ssafy.recode.domain.feed.repository.LikeRepository;
import com.ssafy.recode.domain.follow.entity.Follow;
import com.ssafy.recode.domain.follow.repository.FollowRepository;
import com.ssafy.recode.domain.note.dto.response.NoteResponseDto;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.repository.NoteRepository;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final NoteRepository noteRepository;

    /** 좋아요 수 조회 */
    public int getLikeCount(Long noteId) {
        return likeRepository.countByNote_NoteId(noteId);
    }

    /** 댓글 수 조회 */
    public int getCommentCount(Long noteId) {
        return commentRepository.countByFeed_NoteId(noteId);
    }

    /** 좋아요 추가 */
    public Long addLike(User user, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feed not found"));

        Optional<Like> existing = likeRepository.findByUserAndNote(user, note);
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "이미 좋아요를 눌렀습니다.");
        }

        Like like = Like.builder()
                .user(user)
                .note(note)
                .build();

        return likeRepository.save(like).getLikeId();
    }

    /** 좋아요 삭제 */
    @Transactional
    public void removeLike(User user, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        Like like = likeRepository.findByUserAndNote(user, note)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        System.out.println("[삭제 요청] likeId: " + like.getLikeId());
        likeRepository.delete(like);
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

    public Page<FeedResponseDto> getAllFeeds(User user, String tag, String search, Pageable pageable) {
        Page<Note> notes;

        boolean hasTag = tag != null && !tag.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasTag && hasSearch) {
            notes = noteRepository.searchNotesByTagAndKeyword(tag, search, pageable);
        } else if (hasTag) {
            notes = noteRepository.findByTags_TagNameAndIsPublicTrueAndIsDeletedFalse(tag, pageable);
        } else if (hasSearch) {
            notes = noteRepository.searchNotesOnly(search, pageable);
        } else {
            notes = noteRepository.findAllByIsPublicTrueAndIsDeletedFalse(pageable);
        }

        return notes.map(note -> {
            int likeCount = likeRepository.countByNote_NoteId(note.getNoteId());
            int commentCount = commentRepository.countByFeed_NoteId(note.getNoteId());
            boolean isLiked = likeRepository.existsByUserAndNote(user, note);
            boolean isFollowing = followRepository.existsByFollowerAndFollowing(user, note.getUser());
            ProblemEntity problem = new ProblemEntity(note.getProblemId(), note.getProblemName(), note.getProblemTier());

            return FeedResponseDto.builder()
                    .noteId(note.getNoteId())
                    .noteTitle(note.getNoteTitle())
                    .isPublic(note.getIsPublic())
                    .isLiked(isLiked)
                    .isFollowing(isFollowing)
                    .createdAt(note.getCreatedAt().toString())
                    .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt().toString() : null)
                    .viewCount(note.getViewCount())
                    .likeCount(likeCount)
                    .commentCount(commentCount)
                    .user(UserDto.from(user))
                    .problem(ProblemDto.from(problem))
                    .tags(note.getTags().stream().map(TagDto::from).toList())
                    .isDeleted(note.getIsDeleted())
                    .build();
        });
    }

    /** 팔로잉 피드 조회 */
    public Page<FeedResponseDto> getFeedsOfFollowings(User user, String tag, String search, Pageable pageable) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Follow> followings = followRepository.findByFollower(user);
        List<User> followingUsers = followings.stream()
                .map(Follow::getFollowing)
                .toList();
        System.out.println("팔로우한 유저 수: " + followingUsers.size());
        followingUsers.forEach(u -> System.out.println("팔로우 유저 닉네임: " + u.getNickname()));

        if (followingUsers.isEmpty()) {
            return Page.empty(pageable);
        }
        Page<Note> notesPage;

        // 조건 분기
        if (tag != null && !tag.isBlank() && search != null && !search.isBlank()) {
            notesPage = noteRepository.searchNotesOfUsersByTagAndKeyword(followingUsers, tag, search, pageable);
        } else if (tag != null && !tag.isBlank()) {
            notesPage = noteRepository.searchNotesOfUsersByTag(followingUsers, tag, pageable);
        } else if (search != null && !search.isBlank()) {
            notesPage = noteRepository.searchNotesOfUsersByKeyword(followingUsers, search, pageable);
        } else {
            notesPage = noteRepository.findByUserInAndIsPublicTrueAndIsDeletedFalse(followingUsers, pageable);
        }

        // DTO 변환은 그대로 유지
        List<FeedResponseDto> dtoList = notesPage.stream()
                .map(note -> {
                    int likeCount = likeRepository.countByNote_NoteId(note.getNoteId());
                    int commentCount = commentRepository.countByFeed_NoteId(note.getNoteId());

                    boolean isLiked = likeRepository.existsByUserAndNote(user, note);
                    boolean isFollowing = followRepository.existsByFollowerAndFollowing(user, note.getUser());
                    ProblemEntity problem = new ProblemEntity(
                            note.getProblemId(),
                            note.getProblemName(),
                            note.getProblemTier()
                    );

                    return FeedResponseDto.builder()
                            .noteId(note.getNoteId())
                            .noteTitle(note.getNoteTitle())
                            .content(note.getContent())
                            .successCode(note.getSuccessCode())
                            .successCodeStart(note.getSuccessCodeStart())
                            .successCodeEnd(note.getSuccessCodeEnd())
                            .successLanguage(note.getSuccessLanguage())
                            .failCode(note.getFailCode())
                            .failCodeStart(note.getFailCodeStart())
                            .failCodeEnd(note.getFailCodeEnd())
                            .failLanguage(note.getFailLanguage())
                            .isPublic(note.getIsPublic())
                            .isLiked(isLiked)
                            .isFollowing(isFollowing)
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

    /** userID로 댓글 전체 조회 */
    public List<CommentResponseDto> getCommentsByUserId(Long userId) {
        return commentRepository.findAllByUser_UserId(userId).stream()
                .map(CommentResponseDto::from)
                .collect(Collectors.toList());
    }


    public NoteResponseWrapper getLikedNotesByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "note.noteId"));
        Page<Like> likePage = likeRepository.findAllByUser_UserId(userId, pageable);

        List<NoteResponseDto> details = likePage
                .map(like -> NoteResponseDto.from(like.getNote()))
                .toList();

        return NoteResponseWrapper.builder()
                .details(details)
                .pageable(NoteResponseWrapper.PageableInfo.builder()
                        .pageNumber(likePage.getNumber())
                        .pageSize(likePage.getSize())
                        .build())
                .totalElements(likePage.getTotalElements())
                .totalPages(likePage.getTotalPages())
                .last(likePage.isLast())
                .build();
    }
}
