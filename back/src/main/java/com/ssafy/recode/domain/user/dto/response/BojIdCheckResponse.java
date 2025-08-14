package com.ssafy.recode.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BojIdCheckResponse {
    private BojIdCheckStatus status;
    private String message;
}