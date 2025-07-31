package com.ssafy.recode;

import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.repository.NoteRepository;
import com.ssafy.recode.domain.tag.entity.Tag;
import com.ssafy.recode.domain.tag.repository.TagRepository;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@Commit
public class NoteIntegrationTest {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void 노트_태그_저장_테스트() {
        User user = userRepository.save(User.builder()
                .recodeId("recode_test_002")
                .bojId("boj_test_002")
                .email("test002@example.com")
                .nickname("테스트유저002")
                .password("password123")
                .userTier(5)
                .bio("테스트용 소개글입니다.")
                .isDeleted(false)
                .build());

        Tag tag1 = tagRepository.findByTagName("DP")
                .orElseGet(() -> tagRepository.save(Tag.builder().tagName("DP").build()));

        Tag tag2 = tagRepository.findByTagName("문자열")
                .orElseGet(() -> tagRepository.save(Tag.builder().tagName("문자열").build()));

        Note note = Note.builder()
                .noteTitle("테스트 노트")
                .content("로직 분석")
                .tags(List.of(tag1, tag2))
                .problemId(123L)
                .problemName("123번 문제")
                .problemTier(11)
                .user(user) // ✅ 꼭 필요
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isPublic(true) // ✅ 꼭 필요
                .isDeleted(false) // ✅ 꼭 필요
                .successCode("정답 코드 예시")
                .successCodeStart(1)
                .successCodeEnd(10)
                .failCode("오답 코드 예시")
                .failCodeStart(1)
                .failCodeEnd(5)
                .build();

        Note savedNote = noteRepository.save(note);

        List<Tag> tags = savedNote.getTags();

        assertThat(tags).hasSize(2);
        assertThat(tags).extracting(Tag::getTagName).containsExactlyInAnyOrder("DP", "문자열");
    }
}
