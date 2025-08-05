package com.ssafy.recode.domain.feed.dto.response;

import com.ssafy.recode.domain.feed.entity.Comment;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private UserDto user;
    private Long noteId;
    private String content;
    private String createdAt;
    private String updatedAt;

    public static CommentResponseDto from(Comment comment) {
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .user(UserDto.from(comment.getUser()))
                .noteId(comment.getFeed().getNoteId()) // ✅ Note 엔티티 통째로 넘기지 말고 ID만 사용
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().toString())
                .updatedAt(comment.getUpdatedAt() != null ? comment.getUpdatedAt().toString() : null)
                .build();
    }
}
