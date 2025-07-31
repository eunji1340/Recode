package com.ssafy.recode.domain.solvedac.service;

import com.ssafy.recode.domain.solvedac.dto.SolvedacResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.http.HttpHeaders;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class SolvedacService {

    private final RestTemplate restTemplate;

//    public SolvedacResponseDto getSuggestions(String query){
//        // URL 생성
//        String url = UriComponentsBuilder
//                .fromHttpUrl("https://solved.ac/api/v3/search/suggestion")
//                .queryParam("query", query)
//                .build()
//                .encode(StandardCharsets.UTF_8)
//                .toUriString();
//
//        // 요청 헤더 생성
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("");
//
//    }

}
