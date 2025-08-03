package com.ssafy.recode.domain.problem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Getter
@NoArgsConstructor
public class SubmissionResultDto {
    private Map<String, SubmissionGroupDto> data = new HashMap<>();

    public SubmissionResultDto(SubmissionGroupDto pass, SubmissionGroupDto fail) {
        this.data.put("pass", pass);
        this.data.put("fail", fail);
    }
}
