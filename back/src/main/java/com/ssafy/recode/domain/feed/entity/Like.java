package com.ssafy.recode.domain.feed.entity;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@Getter
@Setter
@NoArgsConstructor
public class Like {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    @Builder
    public Like(Note note, User user) {
        this.note = note;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }
}
