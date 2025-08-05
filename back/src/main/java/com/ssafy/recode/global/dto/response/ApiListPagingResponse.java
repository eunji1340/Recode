package com.ssafy.recode.global.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiListPagingResponse<T> {

    private Data<T> data;

    public static <T> ApiListPagingResponse<T> from(List<T> details, long totalElements, int totalPages, boolean last) {
        return new ApiListPagingResponse<>(new Data<>(details, totalElements, totalPages, last));
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Data<T> {
        private List<T> details;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }
}
