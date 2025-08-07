package com.ssafy.recode.global.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiSingleResponse<T> {
    private T data;

    public static <T> ApiSingleResponse<T> from(T data) {
        return new ApiSingleResponse<>(data);
    }
}
