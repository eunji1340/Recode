package com.ssafy.recode.domain.problem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SubmissionDetailDto {
    private Long submissionId;
    private String language;
    private String codeLength;
    private String submittedAt;
    private Integer runtime;
    private Integer memory;
    private String code;
    private String resultText;

    public SubmissionDetailDto(Long submissionId, String language, String codeLength, String submittedAt, Integer runtime, Integer memory, String code, String resultText) {
        this.submissionId = submissionId;
        this.language = language;
        this.codeLength = codeLength;
        this.submittedAt = submittedAt;
        this.runtime = runtime;
        this.memory = memory;
        this.code = code;
        this.resultText = resultText;
    }
}
