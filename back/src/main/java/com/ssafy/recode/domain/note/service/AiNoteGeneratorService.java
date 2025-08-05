package com.ssafy.recode.domain.note.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Value("${GMS_API_KEY}")
    private String gmsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateNoteContent(String successCode, String failCode, String problemName, int problemTier) {
        String prompt = buildPrompt(successCode, failCode, problemName, problemTier);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(gmsApiKey);

        String json = String.format("""
    {
      "model": "gpt-4o",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": %s
        }
      ]
    }
    """, toJsonString(prompt));

        HttpEntity<String> request = new HttpEntity<>(json, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");

            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            } else {
                return "⚠️ GPT 응답에서 결과를 찾을 수 없습니다.";
            }

        } catch (HttpClientErrorException e) {
            System.err.println("❌ HTTP 오류 발생: " + e.getStatusCode());
            System.err.println("❌ 응답 바디: " + e.getResponseBodyAsString());
            return "❌ 요청 실패: " + e.getStatusCode();
        } catch (Exception e) {
            System.err.println("❌ 예외 발생: " + e.getMessage());
            return "❌ 예외 발생: " + e.getMessage();
        }
    }

    private String toJsonString(String text) {
        return "\"" + text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r") + "\"";
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
