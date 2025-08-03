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

@Component
public class ExternalSubmissionApiClient {
    public SubmissionResultDto getSubmissions(int problemId, String bojId) {
        WebDriver driver = new ChromeDriver();

//    https://www.acmicpc.net/status?problem_id=2667&user_id=777xyz&language_id=-1&result_id=-1
        String url = "https://www.acmicpc.net/status?problem_id=" + problemId + "&user_id=" + bojId;

        List<SubmissionDetailDto> passList = new ArrayList<>();
        List<SubmissionDetailDto> failList = new ArrayList<>();

        try {
            driver.get(url);
        List<WebElement> rows = driver.findElements(By.cssSelector("table#status-table tbody tr"));

        for (WebElement row : rows) {
            try {
                String solutionId = row.getAttribute("id").replace("solution-", "");
                String resultText = getTextOrEmpty(row, "td.result span");
                String memory = getTextOrEmpty(row, "td.memory");
                String runtime = getTextOrEmpty(row, "td.time");

                List<WebElement> tds = row.findElements(By.tagName("td"));
                String language = safeGetText(tds, 6);
                String submittedAt = safeGetText(tds, 9);

                // codeLength가 없는 경우: 임의 설정
                String codeLength = "알 수 없음";

                // 제출 코드 추출
                String code = fetchCode(driver, solutionId);

                SubmissionDetailDto dto = new SubmissionDetailDto(
                        Long.parseLong(solutionId),
                        language,
                        codeLength,
                        submittedAt,
                        parseOrNull(runtime),
                        parseOrNull(memory),
                        code,
                        resultText
                );

                if (resultText.contains("맞았습니다")) {
                    passList.add(dto);
                } else {
                    failList.add(dto);
                }

            } catch (Exception e) {
                System.out.println("❗ 오류 발생 in row. solutionId 처리 실패: " + e.getMessage());
                e.printStackTrace();
            }
        }


        return new SubmissionResultDto(
                    new SubmissionGroupDto(passList),
                    new SubmissionGroupDto(failList)
            );
        }
        finally {
//        driver.quit();
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
