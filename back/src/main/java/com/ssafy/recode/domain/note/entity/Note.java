package com.ssafy.recode.domain.note.entity;

import com.ssafy.recode.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer problemId;
    private String problemName;
    private Integer problemTier;
    private String noteTitle;

    @Lob
    private String content;

    private String successCode;
    private Integer successCodeStart;
    private Integer successCodeEnd;
    private Integer failCodeStart;
    private Integer failCodeEnd;
    private String failCode;

    private Boolean isPublic;
    private Boolean isDeleted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer viewCount;
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer likedCount;

}
