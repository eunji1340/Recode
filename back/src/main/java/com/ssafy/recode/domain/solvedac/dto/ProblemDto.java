package com.ssafy.recode.domain.solvedac.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProblemDto {
    private Long id; //문제 id
    private String title; //문제 제목
    private int level; //문제 레벨
    private int solved; //푼 사람 수
    private String caption; //자동 완성 제목
    private String description; //자동 완성 요소의 설명
    private String href;

    public ProblemDto(Long id, String title, int level, int solved, String caption, String description, String href) {
        this.id = id;
        this.title = title;
        this.level = level;
        this.solved = solved;
        this.caption = caption;
        this.description = description;
        this.href = "https://www.acmicpc.net/problem/" + id;
    }
}
