package com.ssafy.record.domain.solvedac.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SolvedacResponseDto {
    private List<AutocompleteItemDto> autocomplete;
    private List<ProblemDto> problems;
    private int problemCount;

    public SolvedacResponseDto(List<AutocompleteItemDto> autocomplete, List<ProblemDto> problems, int problemCount) {
        this.autocomplete = autocomplete;
        this.problems = problems;
        this.problemCount = problemCount;
    }
}
