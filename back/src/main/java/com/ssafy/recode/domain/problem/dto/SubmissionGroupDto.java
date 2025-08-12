package com.ssafy.recode.domain.problem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SubmissionGroupDto {
    private int count;
    private List<SubmissionDetailDto> detail;

    public SubmissionGroupDto(List<SubmissionDetailDto> detail) {
        this.detail = detail;
        this.count = detail.size();
    }
}
