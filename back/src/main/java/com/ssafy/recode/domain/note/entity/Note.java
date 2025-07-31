package com.ssafy.recode.domain.note.entity;

import com.ssafy.recode.domain.tag.entity.Tag;
import com.ssafy.recode.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    private Long problemId;
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

    @Builder.Default
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0;

    @Builder.Default
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer likeCount = 0;

    @Builder.Default
    @Column(columnDefinition =  "INT DEFAULT 0")
    private Integer commentCount = 0;

    @ManyToMany
    @JoinTable(
            name = "notes_tags",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

}
