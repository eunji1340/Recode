package com.ssafy.recode.domain.problem.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import com.ssafy.recode.domain.problem.service.SubmissionService;
import com.ssafy.recode.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-key")
@RequestMapping("/problems")
public class SubmissionController {

    private final SubmissionService submissionService;

    private final UserService userService;

    @Operation(summary = "성공 코드/실패 코드 조회", description = "백준에서 성공 코드/실패 코드를 조회합니다.")
    @GetMapping("/{problemId}/submissions")
    public ResponseEntity<SubmissionResultDto> getSubmissions(
            @PathVariable int problemId,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = principal.getUserId();
        SubmissionResultDto result = submissionService.getSubmissions(problemId, userId);
        return ResponseEntity.ok(result);
    }
}
