package com.ssafy.recode.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UserListResponseDto {
    private int count;
    private List<UserResponseDto> details;
}
