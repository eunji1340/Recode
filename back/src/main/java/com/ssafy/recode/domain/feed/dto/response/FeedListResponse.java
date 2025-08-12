package com.ssafy.recode.domain.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FeedListResponse {
    private List<FeedResponseDto> details;
}
