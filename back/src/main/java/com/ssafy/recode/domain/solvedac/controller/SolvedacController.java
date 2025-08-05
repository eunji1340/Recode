package com.ssafy.recode.domain.solvedac.controller;

import com.ssafy.recode.domain.solvedac.dto.SolvedacResponseDto;
import com.ssafy.recode.domain.solvedac.service.SolvedacService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/solvedac")
public class SolvedacController {

    private final SolvedacService solvedacService;

    /**
     * 사용자 검색어에 대한 자동완성 + 문제 리스트 제공
     * 예: /solvedac/suggestion?query=dp
     */
    @Operation(summary = "검색어 자동완성 및 문제 리스트 조회", description = "query를 기반으로 Solved.ac에서 자동완성과 문제 리스트를 가져옵니다.")
    @GetMapping("/suggestion")
    public SolvedacResponseDto getSuggestions(@RequestParam String query){
        return solvedacService.getSuggestions(query);
    }
}
