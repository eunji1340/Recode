package com.ssafy.recode.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecodeIdDupCheckRequest {
    private String recodeId;
}