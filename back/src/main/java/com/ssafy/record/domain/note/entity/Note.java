package com.ssafy.record.domain.note.entity;

import com.ssafy.record.domain.user.entity.User;
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
    private Integer viewCount;
    private Boolean isPublic;
    private Boolean isDeleted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
