package com.ssafy.recode.domain.note.service;

import com.ssafy.recode.domain.note.dto.request.AiNoteRequestDto;
import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
import com.ssafy.recode.domain.note.dto.response.AiNoteResponseDto;
import com.ssafy.recode.domain.note.dto.response.NoteFeedDto;
import com.ssafy.recode.domain.note.dto.response.NoteResponseDto;
import com.ssafy.recode.domain.note.dto.response.NoteTagDto;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.repository.NoteRepository;
import com.ssafy.recode.domain.solvedac.service.SolvedacApiClient;
import com.ssafy.recode.domain.tag.service.TagService;
import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import com.ssafy.recode.global.exception.BaseException;
import com.ssafy.recode.global.exception.CommonErrorCode;
import com.ssafy.recode.global.exception.NoteNotFoundException;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final SolvedacApiClient solvedacApiClient;
    private final TagService tagService;
    private final AiNoteGeneratorService aiNoteGeneratorService;

    @Transactional
    public Note createNote(NoteRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = Note.builder()
                .user(user)
                .problemId(dto.getProblemId())
                .problemName(dto.getProblemName())
                .problemTier(dto.getProblemTier())
                .noteTitle(dto.getNoteTitle())
                .content(dto.getContent())
                .successCode(dto.getSuccessCode())
                .successCodeStart(dto.getSuccessCodeStart())
                .successCodeEnd(dto.getSuccessCodeEnd())
                .successLanguage(dto.getSuccessLanguage())
                .failCode(dto.getFailCode())
                .failCodeStart(dto.getFailCodeStart())
                .failCodeEnd(dto.getFailCodeEnd())
                .failLanguage(dto.getFailLanguage())
                .viewCount(0)
                .isPublic(dto.getIsPublic())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        Note savedNote = noteRepository.save(note);

        //solved.ac에서 태그 조회 및 저장
        List<String> tagList = solvedacApiClient.getTagsByProblemId(dto.getProblemId());
        tagService.saveTagsForNote(note, tagList);

        return savedNote;
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

    @Transactional(readOnly = true)
    public AiNoteResponseDto generateAiNote(AiNoteRequestDto dto) {
        String content = aiNoteGeneratorService.generateNoteContent(
                dto.getSuccessCode(),
                dto.getFailCode(),
                dto.getProblemName(),
                dto.getProblemTier()
        );

        return AiNoteResponseDto.builder()
                .content(content)
                .build();
    }

    /** 노트 삭제 **/
    @Transactional
    public void deleteNote(Long noteId) {
        Note note = findNoteById(noteId);
        note.markAsDeleted();
        noteRepository.save(note);
    }

    /** 노트 조회 공통 로직 **/
    private Note findNoteById(Long noteId){
        return noteRepository.findByNoteIdAndIsDeletedFalse(noteId)
                .orElseThrow(()-> new EntityNotFoundException("존재하지 않거나 삭제된 노트입니다."));
    }

    /** 노트 수정 **/
    @Transactional
    public void updateNote(Long noteId, NoteRequestDto dto) {
        Note note = findNoteById(noteId);
        note.updateNote(dto);
    }

    /** 특정 노트 조회 **/
    public NoteFeedDto getNoteFeedDtoById(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new NoteNotFoundException(noteId));
        return NoteFeedDto.from(note);
    }

    public Long getNotesByUserId(Long userId){
        if (userId == null) {
            throw BaseException.of(CommonErrorCode.INVALID_INPUT_VALUE);
        }

        if (!userRepository.existsById(userId)) {
            throw BaseException.of(CommonErrorCode.USER_NOT_FOUND);
        }

        List<Note> notes = noteRepository.findByUser_UserId(userId);
        long result = notes.size();
        return result;
    }

    public List<NoteTagDto> getNoteCountGroupedByTag(Long userId) {
        if (userId == null) {
            throw BaseException.of(CommonErrorCode.INVALID_INPUT_VALUE);
        }

        List<Note> notes = noteRepository.findAllByUserIdWithTags(userId);

        Map<String, Long> countMap = new HashMap<>();
        for (Note note : notes) {
            note.getTags().forEach(tag ->
                    countMap.put(tag.getTagName(),
                            countMap.getOrDefault(tag.getTagName(), 0L) + 1)
            );
        }

        List<NoteTagDto> result = new ArrayList<>();
        countMap.forEach((tag, count) -> result.add(new NoteTagDto(tag, count)));

        return result;
    }
}
