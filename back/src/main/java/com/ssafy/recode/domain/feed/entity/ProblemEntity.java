package com.ssafy.recode.domain.feed.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProblemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long problemId;
    private String problemName;
    private Integer problemTier;
}
