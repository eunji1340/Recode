package com.ssafy.recode.domain.problem.controller;

import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import com.ssafy.recode.domain.problem.service.SubmissionService;
import com.ssafy.recode.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    private final UserService userService;

    @GetMapping("/{problemId}/submissions")
    public ResponseEntity<SubmissionResultDto> getSubmissions(
            @PathVariable int problemId,
            @RequestParam Long userId //TODO: Spring Security 적용 시 제거 예정
    ) {
        String bojId = userService.getBaekjoonId(userId);

        SubmissionResultDto result = submissionService.getSubmissions(problemId, userId);
        return ResponseEntity.ok(result);
    }
}
