package com.ssafy.recode.domain.solvedac.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SolvedacApiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<String> getTagsByProblemId(Long problemId) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://solved.ac/api/v3/problem/show")
                .queryParam("problemId", problemId)
                .build()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-solvedac-language", "ko");

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
        );

        Map<String, Object> body = responseEntity.getBody();

        List<Map<String, Object>> tags = (List<Map<String, Object>>) body.get("tags");

        return tags.stream()
                .map(tag -> {
                    List<Map<String, String>> displayNames = (List<Map<String, String>>) tag.get("displayNames");
                    return displayNames.stream()
                            .filter(display -> "ko".equals(display.get("language")))
                            .findFirst()
                            .map(display -> display.get("name"))
                            .orElse((String) tag.get("key"));  // 한글 없으면 key 사용
                })
                .collect(Collectors.toList());
    }

}
