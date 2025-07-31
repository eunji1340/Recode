package com.ssafy.recode.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NicknameDupCheckRequest {
    private String nickname;
}