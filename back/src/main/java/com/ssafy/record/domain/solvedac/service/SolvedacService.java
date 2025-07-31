package com.ssafy.record.domain.solvedac.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class SolvedacService {

    private final RestTemplate restTemplate;


}
