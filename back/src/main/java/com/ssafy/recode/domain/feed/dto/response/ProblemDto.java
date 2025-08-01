package com.ssafy.recode.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProblemDto {
    private Integer problemId;
    private String problemName;
    private Integer problemTier;
}
