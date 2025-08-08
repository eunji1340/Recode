package com.ssafy.recode.domain.problem.service;

import com.ssafy.recode.domain.problem.client.ExternalSubmissionApiClient;
import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.Cookie;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final UserService userService; // bojId 조회용
    private final ExternalSubmissionApiClient apiClient; // 백준 크롤링용

    public SubmissionResultDto getSubmissions(int problemId, Long userId) {
        User user = userService.findUserById(userId);
        Set<Cookie> cookies  = user.getBojCookies();

        // 3. 쿠키 정보가 없으면 오류를 반환합니다.
        if (cookies  == null || cookies .isEmpty()) {
            throw new IllegalStateException("사용자의 백준 로그인 정보가 없습니다. 다시 로그인해주세요.");
        }

        String bojId = user.getBojId();

        // 4. apiClient.getSubmissions를 호출할 때 쿠키를 함께 전달합니다.
        return apiClient.getSubmissions(problemId, bojId, cookies);
    }
}
