package com.ssafy.recode.domain.solvedac.service;

import com.ssafy.recode.domain.solvedac.dto.AutocompleteItemDto;
import com.ssafy.recode.domain.solvedac.dto.ProblemDto;
import com.ssafy.recode.domain.solvedac.dto.SolvedacResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolvedacService {

    private final RestTemplate restTemplate;

    public SolvedacResponseDto getSuggestions(String query) {
        // URL 생성
        String url = UriComponentsBuilder
                .fromHttpUrl("https://solved.ac/api/v3/search/suggestion")
                .queryParam("query", query)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        // 요청 헤더 생성: 응답 받을 언어 한국어로 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-solvedac-language", "ko");

        // 요청 객체 생성
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        // GET요청 보내기
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
        );

        // 응답 가공
        Map<String, Object> body = responseEntity.getBody();

        // autocomplete
        List<AutocompleteItemDto> autocomplete = ((List<Map<String, String>>) body.get("autocomplete"))
                .stream()
                .map(item -> new AutocompleteItemDto(item.get("caption"), item.get("description")))
                .collect(Collectors.toList());

        // problems
        List<ProblemDto> problems = ((List<Map<String, Object>>) body.get("problems"))
                .stream()
                .map(p -> new ProblemDto(
                        ((Number) p.get("id")).longValue(),
                        (String) p.get("title"),
                        (Integer) p.get("level"),
                        ((Number) p.get("solved")).intValue(),
                        (String) p.get("caption"),
                        (String) p.get("description"),
                        (String) p.get("href")
                ))
                .collect(Collectors.toList());

        // problemCount
        int problemCount = (Integer) body.get("problemCount");

        return new SolvedacResponseDto(autocomplete, problems, problemCount);
    }

}
