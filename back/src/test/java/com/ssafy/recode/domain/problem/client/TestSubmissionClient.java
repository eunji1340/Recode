package com.ssafy.recode.domain.problem.client;

import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import org.openqa.selenium.Cookie;

import java.util.HashSet;
import java.util.Set;

public class TestSubmissionClient {
    public static void main(String[] args) {
        // 💡 아래 YOUR_BOJ_ID와 YOUR_COOKIE_VALUE는 반드시 실제 값으로 변경해야 합니다.
        //     YOUR_COOKIE_VALUE는 직접 백준에 로그인하여 획득한 OnlineJudge 쿠키 값입니다.
        String bojId = "777xyz";
        int problemId = 1000; // 테스트할 문제 번호 (예: A+B)

        // 1. 유효한 쿠키를 수동으로 생성합니다.
        Set<Cookie> cookies = new HashSet<>();
        cookies.add(
                new Cookie.Builder("OnlineJudge", "2na6b9j63mcbdq0ervokvlqee8")
                        .domain(".acmicpc.net")  // 도메인 속성을 복사하여 입력
                        .path("/")              // 경로 속성을 복사하여 입력
                        .isSecure(true)         // HTTPS 사용 시 true로 설정
                        .build()
        );

        // 2. ExternalSubmissionApiClient 인스턴스를 생성합니다.
        ExternalSubmissionApiClient apiClient = new ExternalSubmissionApiClient();

        System.out.println("백준 제출 기록 크롤링을 시작합니다...");

        try {
            // 3. getSubmissions 메서드를 호출하여 제출 기록을 가져옵니다.
            SubmissionResultDto result = apiClient.getSubmissions(problemId, bojId, cookies);

            if (result != null) {
                System.out.println("✅ 크롤링 성공!");
            } else {
                System.out.println("❌ 크롤링 실패! 반환된 결과가 없습니다.");
            }
        } catch (Exception e) {
            System.err.println("❌ 테스트 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
