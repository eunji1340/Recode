package com.ssafy.recode.domain.problem.service;

import com.ssafy.recode.domain.problem.client.ExternalSubmissionApiClient;
import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import com.ssafy.recode.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final UserService userService; // bojId 조회용
    private final ExternalSubmissionApiClient apiClient; // 백준 크롤링용

    public SubmissionResultDto getSubmissions(int problemId, Long userId) {
        String bojId = userService.getBaekjoonId(userId);

        return apiClient.getSubmissions(problemId, bojId);
    }
}
