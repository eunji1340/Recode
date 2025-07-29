package com.ssafy.record.global.wrapper;

import com.ssafy.record.domain.note.dto.response.NoteResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NoteResponseWrapper {
    private List<NoteResponseDto> details;
    private PageableInfo pageable;
    private long totalElements;
    private int totalPages;
    private boolean last;

    @Getter
    @Builder
    public static class PageableInfo {
        private int pageNumber;
        private int pageSize;
    }
}
