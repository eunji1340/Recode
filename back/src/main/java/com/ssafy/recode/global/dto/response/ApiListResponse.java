package com.ssafy.recode.global.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ApiListResponse<T> {
    private List<T> details;

    public static <T> ApiListResponse<T> from(List<T> list) {
        return new ApiListResponse<>(list);
    }
}
