package com.ssafy.recode.domain.problem.client;

import com.ssafy.recode.domain.problem.dto.SubmissionDetailDto;
import com.ssafy.recode.domain.problem.dto.SubmissionGroupDto;
import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class ExternalSubmissionApiClient {

    public SubmissionResultDto getSubmissions(int problemId, String bojId, Set<Cookie> cookies) {
        // 💡 변경: 쿠키 정보가 없으면 오류를 발생시킵니다.
        if (cookies == null || cookies.isEmpty()) {
            throw new IllegalArgumentException("쿠키 정보가 없습니다. 먼저 백준 로그인을 진행해야 합니다.");
        }

        WebDriver driver = new ChromeDriver();

        List<SubmissionDetailDto> submissionList = new ArrayList<>();
        List<SubmissionDetailDto> passList = new ArrayList<>();
        List<SubmissionDetailDto> failList = new ArrayList<>();

        try {
            // 1. 빈 페이지에 접속하여 쿠키를 주입할 수 있도록 준비합니다.
            driver.get("https://www.acmicpc.net");
            for (Cookie cookie : cookies) {
                driver.manage().addCookie(cookie);
            }

            // 2. 쿠키가 적용된 상태로 제출 기록 페이지에 접속합니다.
            String url = "https://www.acmicpc.net/status?problem_id=" + problemId + "&user_id=" + bojId;
            driver.get(url);

            List<WebElement> rows = driver.findElements(By.cssSelector("table#status-table tbody tr"));

            // 3. 각 제출의 메타데이터를 추출합니다.
            for (WebElement row : rows) {
                try {
                    String solutionId = row.getAttribute("id").replace("solution-", "");
                    String resultText = getTextOrEmpty(row, "td.result span");
                    String memory = getTextOrEmpty(row, "td.memory");
                    String runtime = getTextOrEmpty(row, "td.time");

                    List<WebElement> tds = row.findElements(By.tagName("td"));
                    String language = safeGetText(tds, 6);
                    String codeLength = safeGetText(tds, 7);
                    String submittedAt = safeGetText(tds, 9);

                    SubmissionDetailDto dto = new SubmissionDetailDto(
                            Long.parseLong(solutionId),
                            language,
                            codeLength,
                            submittedAt,
                            parseOrNull(runtime),
                            parseOrNull(memory),
                            null,
                            resultText
                    );

                    submissionList.add(dto);

                } catch (Exception e) {
                    System.out.println("메타데이터 파싱 오류: " + e.getMessage());
                }
            }

            // 4. 각 제출의 소스 코드를 추출합니다.
            for (SubmissionDetailDto dto : submissionList) {
                String code = fetchCode(driver, String.valueOf(dto.getSubmissionId()));
                dto.setCode(code);
            }

            // 5. 제출 결과를 통과/실패로 분류합니다.
            for (SubmissionDetailDto dto : submissionList) {
                if (dto.getResultText().contains("맞았습니다")) {
                    passList.add(dto);
                } else {
                    failList.add(dto);
                }
            }

            return new SubmissionResultDto(
                    new SubmissionGroupDto(passList),
                    new SubmissionGroupDto(failList)
            );
        } finally {
            // 6. 모든 작업이 끝나면 드라이버를 안전하게 종료합니다.
            driver.quit();
        }
    }

    private String fetchCode(WebDriver driver, String solutionId) {
        try {
            driver.get("https://www.acmicpc.net/source/" + solutionId);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("pre.CodeMirror-line")));

            List<WebElement> lineElements = driver.findElements(By.cssSelector("pre.CodeMirror-line"));
            StringBuilder code = new StringBuilder();
            for (WebElement line : lineElements) {
                code.append(line.getText()).append("\n");
            }

            return code.toString().trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "코드 추출 실패";
        }
    }

    /** 비어 있으면 null 반환하는 정수 파서 */
    private Integer parseOrNull(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (Exception e) {
            return null;
        }
    }

    /** CSS 셀렉터로 안전하게 텍스트 추출 */
    private String getTextOrEmpty(WebElement parent, String selector) {
        try {
            return parent.findElement(By.cssSelector(selector)).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    /** 인덱스 접근 시 안전하게 텍스트 추출 */
    private String safeGetText(List<WebElement> tds, int index) {
        try {
            return tds.get(index).getText().trim();
        } catch (Exception e) {
            return "";
        }
    }
}
