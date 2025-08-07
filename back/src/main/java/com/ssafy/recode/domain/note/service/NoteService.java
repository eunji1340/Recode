package com.ssafy.recode.domain.note.service;

import com.ssafy.recode.domain.feed.dto.response.FeedResponseDto;
import com.ssafy.recode.domain.feed.dto.response.ProblemDto;
import com.ssafy.recode.domain.feed.dto.response.TagDto;
import com.ssafy.recode.domain.feed.dto.response.UserDto;
import com.ssafy.recode.domain.feed.entity.ProblemEntity;
import com.ssafy.recode.domain.feed.repository.CommentRepository;
import com.ssafy.recode.domain.feed.repository.LikeRepository;
import com.ssafy.recode.domain.follow.repository.FollowRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final SolvedacApiClient solvedacApiClient;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
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

    // 노트 조회
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

    // 타인 노트 조회
    public NoteResponseWrapper getNotesByUserId(long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "noteId"));
        Page<Note> notePage = noteRepository.findAllByUser_UserId(userId, pageable);

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
    @Transactional(readOnly = true)
    public FeedResponseDto getNoteFeedDtoById(User loginUser, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new NoteNotFoundException(noteId));

        boolean isLiked = likeRepository.existsByUserAndNote(loginUser, note);
        boolean isFollowing = followRepository.existsByFollowerAndFollowing(loginUser, note.getUser());

        int likeCount = likeRepository.countByNote_NoteId(noteId);
        int commentCount = commentRepository.countByFeed_NoteId(noteId);
        ProblemEntity problem = new ProblemEntity(
                note.getProblemId(),
                note.getProblemName(),
                note.getProblemTier()
        );

        return FeedResponseDto.builder()
                .noteId(note.getNoteId())
                .noteTitle(note.getNoteTitle())
                .content(note.getContent())
                .successCode(note.getSuccessCode())
                .successCodeStart(note.getSuccessCodeStart())
                .successCodeEnd(note.getSuccessCodeEnd())
                .successLanguage(note.getSuccessLanguage())
                .failCode(note.getFailCode())
                .failCodeStart(note.getFailCodeStart())
                .failCodeEnd(note.getFailCodeEnd())
                .failLanguage(note.getFailLanguage())
                .isPublic(note.getIsPublic())
                .isLiked(isLiked)
                .isFollowing(isFollowing)
                .createdAt(note.getCreatedAt().toString())
                .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt().toString() : null)
                .viewCount(note.getViewCount())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .user(UserDto.from(note.getUser()))
                .problem(ProblemDto.from(problem))
                .tags(note.getTags().stream()
                        .map(TagDto::from)
                        .collect(Collectors.toList()))
                .isDeleted(note.getIsDeleted())
                .build();
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

    public Long getNotesByCreatedAt(Long userId) {
        if (userId == null) {
            throw BaseException.of(CommonErrorCode.INVALID_INPUT_VALUE);
        }

        try {
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            List<Note> noteList = noteRepository.findByUser_UserIdAndCreatedAtAfter(userId, thirtyDaysAgo);
            return (long) noteList.size();

        } catch (Exception e) {
            throw BaseException.of(CommonErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public Long getStreak(Long userId) {
        if (userId == null) {
            throw BaseException.of(CommonErrorCode.INVALID_INPUT_VALUE);
        }

        try {
            // 1. createdAt 날짜 목록 가져오기 (LocalDateTime)
            List<LocalDateTime> dateTimes = noteRepository.findAllNoteDateTimesByUserId(userId);

            // 2. LocalDate로 변환해서 Set으로 중복 제거
            Set<LocalDate> dateSet = dateTimes.stream()
                    .map(LocalDateTime::toLocalDate)
                    .collect(Collectors.toSet());

            // 3. 오늘부터 거꾸로 확인해서 streak 계산
            LocalDate today = LocalDate.now();
            long streak = 0;

            while (dateSet.contains(today.minusDays(streak))) {
                streak++;
            }

            return streak;

        } catch (Exception e) {
            throw BaseException.of(CommonErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
