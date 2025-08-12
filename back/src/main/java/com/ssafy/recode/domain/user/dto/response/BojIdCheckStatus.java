package com.ssafy.recode.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BojIdCheckStatus {
    ALREADY_REGISTERED("이미 회원가입된 아이디입니다."),
    NOT_FOUND_ON_BOJ("백준에 없는 아이디입니다."),
    AVAILABLE("회원 가입 가능한 아이디입니다.");

    private final String message;
}