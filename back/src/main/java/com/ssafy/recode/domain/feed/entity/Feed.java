//package com.ssafy.recode.domain.feed.entity;
//
//import com.ssafy.recode.domain.tag.entity.Tag;
//import com.ssafy.recode.domain.user.entity.User;
//import com.ssafy.recode.global.entity.StringArrayConverter;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
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
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;
//    private Long problemId;
//    private String problemName;
//    private Integer problemTier;
//    private String noteTitle;
//
//    private String content;
//
//    private String successCode;
//    private Integer successCodeStart;
//    private Integer successCodeEnd;
//
//    @Column(name = "success_language", length = 20)
//    private String successLanguage;
//
//    private Integer failCodeStart;
//    private Integer failCodeEnd;
//    private String failCode;
//
//    @Column(name = "fail_language", length = 20)
//    private String failLanguage;
//
//    private Boolean isPublic;
//    private Boolean isDeleted;
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
//    @Convert(converter = StringArrayConverter.class)
//    private List<Tag> tags;
//
//}
