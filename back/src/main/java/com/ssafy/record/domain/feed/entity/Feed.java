//package com.ssafy.record.domain.feed.entity;
//
//import com.ssafy.record.domain.user.entity.User;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@AllArgsConstructor
//@Builder
//public class Feed {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long noteId;
//
//    private String content;
//
//    private Integer successCodeStart;
//    private Integer successCodeEnd;
//
//    private Integer failCodeStart;
//    private Integer failCodeEnd;
//
//    private Boolean isPublic;
//
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//
//    private Integer viewCount;
//
//    private Integer likeCount;
//
//    private Integer commentCount;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    private Long problemId;
//    private String problemName;
//    private Integer problemTier;
//
//    @ElementCollection
//    private List<String> tags = new ArrayList<>();
//
//    @OneToMany(mappedBy = "feed", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Like> likes = new ArrayList<>();
//
//    @OneToMany(mappedBy = "feed", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Comment> comments = new ArrayList<>();
//
//    public void increaseLikeCount() {
//        this.likeCount = (this.likeCount == null ? 1 : this.likeCount + 1);
//    }
//
//    public void decreaseLikeCount() {
//        this.likeCount = (this.likeCount == null || this.likeCount <= 0) ? 0 : this.likeCount - 1;
//    }
//
//    public void increaseCommentCount() {
//        this.commentCount = (this.commentCount == null ? 1 : this.commentCount + 1);
//    }
//
//    public void decreaseCommentCount() {
//        this.commentCount = (this.commentCount == null || this.commentCount <= 0) ? 0 : this.commentCount - 1;
//    }
//}
