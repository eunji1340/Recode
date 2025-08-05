package com.ssafy.recode.domain.tag.service;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.tag.entity.Tag;
import com.ssafy.recode.domain.tag.repository.TagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public void saveTagsForNote(Note note, List<String> tagList) {
        List<Tag> tagsToAdd = new ArrayList<>();

        for (String tagName : tagList) {
            Tag tag = tagRepository.findByTagName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName))); // 없으면 생성
            tagsToAdd.add(tag);
        }

        note.setTags(tagsToAdd); // 기존 태그 덮어씀 (또는 기존에 추가 방식으로 바꿔도 됨)
    }
}
