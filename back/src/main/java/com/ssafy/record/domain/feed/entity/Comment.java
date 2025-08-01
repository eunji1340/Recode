//package com.ssafy.record.domain.feed.entity;
//
//import com.ssafy.record.domain.user.entity.User;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@AllArgsConstructor
//@Builder
//public class Comment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long commentId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "note_id")
//    private Feed feed;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    private String content;
//
//    private LocalDateTime createdAt;
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//}
