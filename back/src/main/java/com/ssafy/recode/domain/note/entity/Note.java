package com.ssafy.recode.domain.note.entity;

import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
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
    @Column(columnDefinition = "LONGTEXT")
    private String successCode;
    private Integer successCodeStart;
    private Integer successCodeEnd;

    @Column(name = "success_language", length = 20)
    private String successLanguage;

    private Integer failCodeStart;
    private Integer failCodeEnd;
    @Column(columnDefinition = "LONGTEXT")
    private String failCode;

    @Column(name = "fail_language", length = 20)
    private String failLanguage;

    private Boolean isPublic;
    private Boolean isDeleted;
    private Boolean isLiked;
    private Boolean isFollowing;

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

    public void markAsDeleted() {
        this.isDeleted = true;
    }

    public void updateNote(NoteRequestDto dto) {
        this.problemId = dto.getProblemId();
        this.problemName = dto.getProblemName();
        this.problemTier = dto.getProblemTier();
        this.noteTitle = dto.getNoteTitle();
        this.content = dto.getContent();
        this.successCode = dto.getSuccessCode();
        this.successCodeStart = dto.getSuccessCodeStart();
        this.successCodeEnd = dto.getSuccessCodeEnd();
        this.successLanguage = dto.getSuccessLanguage();
        this.failCode = dto.getFailCode();
        this.failCodeStart = dto.getFailCodeStart();
        this.failCodeEnd = dto.getFailCodeEnd();
        this.failLanguage = dto.getFailLanguage();
        this.isPublic = dto.getIsPublic();
        this.isLiked = dto.getIsLiked();
        this.isFollowing = dto.getIsFollowing();
        this.updatedAt = LocalDateTime.now();
    }
}
