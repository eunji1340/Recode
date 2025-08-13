package com.ssafy.recode.domain.problem.client;

import com.ssafy.recode.domain.problem.dto.SubmissionDetailDto;
import com.ssafy.recode.domain.problem.dto.SubmissionGroupDto;
import com.ssafy.recode.domain.problem.dto.SubmissionResultDto;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class ExternalSubmissionApiClient {

    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(15);
    private static final Duration SHORT_TIMEOUT = Duration.ofSeconds(5);

    public SubmissionResultDto getSubmissions(int problemId, String bojId, Set<Cookie> cookies) {
        if (cookies == null || cookies.isEmpty()) {
            throw new IllegalArgumentException("쿠키 정보가 없습니다. 먼저 백준 로그인을 진행해야 합니다.");
        }

        ChromeOptions options = createChromeOptionsForUbuntu();
        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, DEFAULT_TIMEOUT);

        List<SubmissionDetailDto> submissionList = new ArrayList<>();
        List<SubmissionDetailDto> passList = new ArrayList<>();
        List<SubmissionDetailDto> failList = new ArrayList<>();

        try {
            // 1. 쿠키 설정
            setupCookies(driver, cookies);

            // 2. 제출 기록 페이지 접속 및 대기
            String url = "https://www.acmicpc.net/status?problem_id=" + problemId + "&user_id=" + bojId;
            driver.get(url);

            // 테이블이 로드될 때까지 대기
            wait.until(ExpectedConditions.presenceOfElementLocated(By.id("status-table")));

            // 추가 대기 (동적 콘텐츠 로딩을 위해)
            Thread.sleep(2000);

            List<WebElement> rows = driver.findElements(By.cssSelector("table#status-table tbody tr"));

            if (rows.isEmpty()) {
                System.out.println("제출 기록이 없거나 페이지 로딩에 실패했습니다.");
                return new SubmissionResultDto(
                        new SubmissionGroupDto(new ArrayList<>()),
                        new SubmissionGroupDto(new ArrayList<>())
                );
            }

            // 3. 메타데이터 추출
            submissionList = extractSubmissionMetadata(rows);

            // 4. 소스 코드 추출
            fetchSourceCodes(driver, submissionList);

            // 5. 결과 분류
            classifySubmissions(submissionList, passList, failList);

            return new SubmissionResultDto(
                    new SubmissionGroupDto(passList),
                    new SubmissionGroupDto(failList)
            );

        } catch (Exception e) {
            System.err.println("크롤링 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new SubmissionResultDto(
                    new SubmissionGroupDto(new ArrayList<>()),
                    new SubmissionGroupDto(new ArrayList<>())
            );
        } finally {
            driver.quit();
        }
    }

    private ChromeOptions createChromeOptionsForUbuntu() {
        ChromeOptions options = new ChromeOptions();

        // Chrome 바이너리 경로 설정 (Ubuntu 환경)
        String chromeBinaryPath = findChromeBinary();
        if (chromeBinaryPath != null) {
            options.setBinary(chromeBinaryPath);
        }

        // 헤드리스 모드 (GUI 없는 서버 환경에서 필수)
        options.addArguments("--headless=new");

        // 보안 및 샌드박스 설정 (EC2 환경에서 필수)
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--disable-software-rasterizer");

        // 메모리 관련 설정
        options.addArguments("--memory-pressure-off");
        options.addArguments("--max_old_space_size=4096");
        options.addArguments("--disable-background-timer-throttling");
        options.addArguments("--disable-backgrounding-occluded-windows");
        options.addArguments("--disable-renderer-backgrounding");

        // 네트워크 및 보안 설정
        options.addArguments("--disable-web-security");
        options.addArguments("--disable-features=VizDisplayCompositor");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-plugins");
        options.addArguments("--disable-images");

        // Anti-detection 설정
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-automation");
        options.addArguments("--disable-web-security");

        // User-Agent 설정
        options.addArguments("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

        // 윈도우 크기 설정
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--start-maximized");

        // 로그 레벨 설정 (불필요한 로그 제거)
        options.addArguments("--log-level=3");
        options.addArguments("--silent");

        // 임시 파일 디렉토리 설정
        options.addArguments("--temp-profile");
        options.addArguments("--disable-default-apps");

        return options;
    }

    private String findChromeBinary() {
        // Ubuntu에서 Chrome이 설치될 수 있는 경로들
        String[] possiblePaths = {
                "/usr/bin/google-chrome",
                "/usr/bin/google-chrome-stable",
                "/usr/bin/chromium-browser",
                "/usr/bin/chromium",
                "/opt/google/chrome/chrome",
                "/snap/bin/chromium"
        };

        for (String path : possiblePaths) {
            File chromeFile = new File(path);
            if (chromeFile.exists() && chromeFile.canExecute()) {
                System.out.println("Chrome binary found at: " + path);
                return path;
            }
        }

        System.out.println("Chrome binary not found in standard locations. Using system default.");
        return null; // 시스템 기본값 사용
    }

    private void setupCookies(WebDriver driver, Set<Cookie> cookies) {
        // 먼저 도메인에 접속
        driver.get("https://www.acmicpc.net");

        // 쿠키 추가
        for (Cookie cookie : cookies) {
            try {
                driver.manage().addCookie(cookie);
            } catch (Exception e) {
                System.out.println("쿠키 추가 실패: " + cookie.getName() + " - " + e.getMessage());
            }
        }

        // 쿠키 적용 확인을 위한 잠시 대기
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private List<SubmissionDetailDto> extractSubmissionMetadata(List<WebElement> rows) {
        List<SubmissionDetailDto> submissionList = new ArrayList<>();

        for (WebElement row : rows) {
            try {
                // ID 추출 (solution-123456 형태에서 숫자만)
                String id = row.getAttribute("id");
                if (id == null || !id.startsWith("solution-")) {
                    continue;
                }
                String solutionId = id.replace("solution-", "");

                // 결과 텍스트 추출
                String resultText = getTextOrEmpty(row, "td.result span");
                if (resultText.isEmpty()) {
                    resultText = getTextOrEmpty(row, "td.result");
                }

                // 메모리, 시간 추출
                String memory = getTextOrEmpty(row, "td.memory");
                String runtime = getTextOrEmpty(row, "td.time");

                // TD 요소들로부터 언어, 코드길이, 제출시간 추출
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
                        null, // 코드는 나중에 설정
                        resultText
                );

                submissionList.add(dto);

            } catch (Exception e) {
                System.out.println("메타데이터 파싱 오류: " + e.getMessage());
                // 개별 행의 오류는 무시하고 계속 진행
            }
        }

        return submissionList;
    }

    private void fetchSourceCodes(WebDriver driver, List<SubmissionDetailDto> submissionList) {
        WebDriverWait shortWait = new WebDriverWait(driver, SHORT_TIMEOUT);

        for (SubmissionDetailDto dto : submissionList) {
            try {
                String code = fetchCode(driver, shortWait, String.valueOf(dto.getSubmissionId()));
                dto.setCode(code);

                // 각 코드 추출 후 잠시 대기 (과도한 요청 방지)
                Thread.sleep(500);

            } catch (Exception e) {
                System.out.println("코드 추출 실패 (ID: " + dto.getSubmissionId() + "): " + e.getMessage());
                dto.setCode("코드 추출 실패");
            }
        }
    }

    private String fetchCode(WebDriver driver, WebDriverWait wait, String solutionId) {
        try {
            String sourceUrl = "https://www.acmicpc.net/source/" + solutionId;
            driver.get(sourceUrl);

            // CodeMirror 요소가 로드될 때까지 대기
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.presenceOfElementLocated(By.cssSelector("pre.CodeMirror-line")),
                    ExpectedConditions.presenceOfElementLocated(By.cssSelector(".CodeMirror-code")),
                    ExpectedConditions.presenceOfElementLocated(By.tagName("pre"))
            ));

            // 여러 방법으로 코드 추출 시도
            String code = tryExtractCode(driver);

            return code.isEmpty() ? "코드 추출 실패" : code;

        } catch (Exception e) {
            return "코드 추출 실패: " + e.getMessage();
        }
    }

    private String tryExtractCode(WebDriver driver) {
        // 방법 1: CodeMirror-line으로 추출
        try {
            List<WebElement> lineElements = driver.findElements(By.cssSelector("pre.CodeMirror-line"));
            if (!lineElements.isEmpty()) {
                StringBuilder code = new StringBuilder();
                for (WebElement line : lineElements) {
                    code.append(line.getText()).append("\n");
                }
                String result = code.toString().trim();
                if (!result.isEmpty()) {
                    return result;
                }
            }
        } catch (Exception e) {
            System.out.println("방법 1 실패: " + e.getMessage());
        }

        // 방법 2: CodeMirror-code로 추출
        try {
            WebElement codeElement = driver.findElement(By.cssSelector(".CodeMirror-code"));
            String result = codeElement.getText().trim();
            if (!result.isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            System.out.println("방법 2 실패: " + e.getMessage());
        }

        // 방법 3: 일반적인 pre 태그로 추출
        try {
            List<WebElement> preElements = driver.findElements(By.tagName("pre"));
            for (WebElement pre : preElements) {
                String text = pre.getText().trim();
                if (!text.isEmpty() && text.length() > 10) { // 의미있는 코드인지 확인
                    return text;
                }
            }
        } catch (Exception e) {
            System.out.println("방법 3 실패: " + e.getMessage());
        }

        return "";
    }

    private void classifySubmissions(List<SubmissionDetailDto> submissionList,
                                     List<SubmissionDetailDto> passList,
                                     List<SubmissionDetailDto> failList) {
        for (SubmissionDetailDto dto : submissionList) {
            String resultText = dto.getResultText().toLowerCase();
            if (resultText.contains("맞았습니다") || resultText.contains("accepted")) {
                passList.add(dto);
            } else {
                failList.add(dto);
            }
        }
    }

    // 기존 헬퍼 메소드들
    private Integer parseOrNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim().replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return null;
        }
    }

    private String getTextOrEmpty(WebElement parent, String selector) {
        try {
            WebElement element = parent.findElement(By.cssSelector(selector));
            return element.getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    private String safeGetText(List<WebElement> tds, int index) {
        try {
            if (index < tds.size()) {
                return tds.get(index).getText().trim();
            }
            return "";
        } catch (Exception e) {
            return "";
        }
    }
}