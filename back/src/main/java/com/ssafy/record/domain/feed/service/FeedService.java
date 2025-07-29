package com.ssafy.record.domain.feed.service;

import com.ssafy.record.domain.feed.dto.response.FeedResponseDto;
import com.ssafy.record.domain.feed.entity.Comment;
import com.ssafy.record.domain.feed.entity.Like;
import com.ssafy.record.domain.feed.repository.CommentRepository;
import com.ssafy.record.domain.feed.repository.LikeRepository;
import com.ssafy.record.domain.user.entity.User;
import com.ssafy.record.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final FeedRepository feedRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public void likeFeed(Long noteId, Long userId) {
        Feed feed = feedRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Feed not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Like like = Like.builder()
                .feed(feed)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        likeRepository.save(like);
    }

    public void unlikeFeed(Long noteId, Long likeId) {
        likeRepository.deleteById(likeId);
    }

    public Comment createComment(Long noteId, Long userId, String content) {
        Feed feed = feedRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Feed not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .feed(feed)
                .user(user)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    public void updateComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.updateContent(content);
        commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public List<FeedResponseDto> getComments(Long noteId) {
        return commentRepository.findByFeed_NoteId(noteId).stream()
                .map(comment -> FeedResponseDto.builder()
                        .commentId(comment.getCommentId())
                        .nickname(comment.getUser().getNickname())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
