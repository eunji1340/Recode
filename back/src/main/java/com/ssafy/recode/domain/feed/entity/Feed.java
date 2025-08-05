package com.ssafy.recode.domain.feed.entity;

import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.global.entity.StringArrayConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    private String content;

    private Integer successCodeStart;
    private Integer successCodeEnd;

    private Integer failCodeStart;
    private Integer failCodeEnd;

    private Boolean isPublic;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer viewCount;

    private Integer likeCount;

    private Integer commentCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private Long problemId;
    private String problemName;
    private Integer problemTier;

    @Convert(converter = StringArrayConverter.class)
    private String[] tags;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "problem_id")
//    private ProblemEntity problem;
//
//    public void setProblem(ProblemEntity problem) {
//        this.problem = problem;
//    }

}
