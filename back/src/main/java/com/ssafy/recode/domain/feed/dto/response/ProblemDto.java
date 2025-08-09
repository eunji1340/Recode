package com.ssafy.recode.domain.feed.dto.response;

import com.ssafy.recode.domain.feed.entity.ProblemEntity;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class ProblemDto {
    private Long problemId;
    private String problemName;
    private Integer problemTier;
    @Builder
    public ProblemDto(Long problemId, String problemName, Integer problemTier) {
        this.problemId = problemId;
        this.problemName = problemName;
        this.problemTier = problemTier;
    }

    public static ProblemDto from(ProblemEntity problem) {
        if (problem == null) return null;
        return ProblemDto.builder()
                .problemId(problem.getProblemId())
                .problemName(problem.getProblemName())
                .problemTier(problem.getProblemTier())
                .build();
    }

}
