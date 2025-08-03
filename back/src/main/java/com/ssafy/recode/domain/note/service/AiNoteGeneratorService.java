package com.ssafy.recode.domain.note.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiNoteGeneratorService {

    @Value("${gms.api.key}")
    private String gmsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateNoteContent(String successCode, String failCode, String problemName, int problemTier) {
        String json = """
{
  "model": "gpt-4.1-nano",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Compare the following two Java codes:\\n\\n[Fail Code]\\nSystem.out.println(\\"hi\\");\\n\\n[Success Code]\\nSystem.out.println(\\"hello world\\");"
    }
  ]
}
""";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(gmsApiKey);
        headers.set("x-target-url", "https://api.openai.com/v1/chat/completions");


        HttpEntity<String> request = new HttpEntity<>(json, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }

            return "⚠️ 응답 형식이 예상과 다릅니다.";

        } catch (HttpClientErrorException e) {
            System.err.println("❌ HTTP 오류 발생: " + e.getStatusCode());
            System.err.println("❌ 응답 바디: " + e.getResponseBodyAsString());
            return "❌ 요청 실패: " + e.getStatusCode();
        } catch (Exception e) {
            System.err.println("❌ 예외 발생: " + e.getMessage());
            return "❌ 예외 발생: " + e.getMessage();
        }
    }


    private String buildPrompt(String successCode, String failCode, String problemName, int problemTier) {
        return String.format("""
            문제 이름: %s (티어 %d)

            [실패 코드]
            %s

            [성공 코드]
            %s

            위 두 코드를 비교하여 다음과 같은 형식으로 Markdown 설명을 작성해주세요:

            ### 실패 원인 분석
            - 실패한 이유 요약

            ### 성공 코드 설명
            - 어떤 방식으로 해결했는지 설명

            ### 비교 요약
            - 어떤 점이 달랐는지 정리
        """, problemName, problemTier, failCode, successCode);
    }

}
