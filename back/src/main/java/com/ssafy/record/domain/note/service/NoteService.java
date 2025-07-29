package com.ssafy.record.domain.note.service;

import com.ssafy.record.domain.note.dto.request.NoteRequestDto;
import com.ssafy.record.domain.note.dto.response.NoteResponseDto;
import com.ssafy.record.domain.note.entity.Note;
import com.ssafy.record.domain.note.repository.NoteRepository;
import com.ssafy.record.domain.user.entity.User;
import com.ssafy.record.domain.user.repository.UserRepository;
import com.ssafy.record.global.wrapper.NoteResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional
    public Note createNote(NoteRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")); // 예외 처리 추가

        Note note = Note.builder()
                .user(user)
                .problemId(Math.toIntExact(dto.getProblemId()))
                .problemName(dto.getProblemName())
                .problemTier(dto.getProblemTier())
                .noteTitle(dto.getNoteTitle())
                .content(dto.getContent())
                .successCode(dto.getSuccessCode())
                .successCodeStart(dto.getSuccessCodeStart())
                .successCodeEnd(dto.getSuccessCodeEnd())
                .failCode(dto.getFailCode())
                .failCodeStart(dto.getFailCodeStart())
                .failCodeEnd(dto.getFailCodeEnd())
                .viewCount(0)
                .isPublic(dto.getIsPublic())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        return noteRepository.save(note);
    }

    public NoteResponseWrapper getNotes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "noteId"));
        Page<Note> notePage = noteRepository.findAll(pageable);

        List<NoteResponseDto> details = notePage
                .stream()
                .map(NoteResponseDto::from)
                .toList();

        return NoteResponseWrapper.builder()
                .details(details)
                .pageable(NoteResponseWrapper.PageableInfo.builder()
                        .pageNumber(notePage.getNumber())
                        .pageSize(notePage.getSize())
                        .build())
                .totalElements(notePage.getTotalElements())
                .totalPages(notePage.getTotalPages())
                .last(notePage.isLast())
                .build();
    }

    public Note getNoteById(Long id) {
        return noteRepository.findById(id).orElseThrow();
    }
}
