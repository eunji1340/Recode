package com.ssafy.recode.domain.note.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.note.dto.request.AiNoteRequestDto;
import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
import com.ssafy.recode.domain.note.dto.response.*;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.service.NoteService;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-key")
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;

    @Operation(summary = "노트 생성", description = "사용자가 새로운 노트를 생성합니다.")
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequestDto dto,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        Note savedNote = noteService.createNote(dto, userId);
        return ResponseEntity.ok(NoteFeedDto.from(savedNote));
    }

    @Operation(summary = "노트 목록 조회", description = "전체 노트를 페이지네이션을 통해 조회합니다.")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        NoteResponseWrapper response = noteService.getNotes(page, size);
        Map<String, Object> body = Map.of("data", response);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "AI 노트 생성", description = "AI를 이용해 자동으로 노트를 생성합니다.")
    @PostMapping("/ai-generate")
    public ResponseEntity<AiNoteResponseDto> generateAiNote(
            @RequestBody AiNoteRequestDto dto) {

        AiNoteResponseDto response = noteService.generateAiNote(dto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "노트 삭제", description = "노트를 논리적으로 삭제합니다.")
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long noteId){
        noteService.deleteNote(noteId);

        Map<String, Object> response = new HashMap<>();
        response.put("data", NoteDeleteResponseDto.builder().noteId(noteId).build());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "노트 수정", description = "기존 노트를 수정합니다.")
    @PutMapping("/{noteId}")
    public ResponseEntity<Map<String, Object>> updateNote(@PathVariable Long noteId,
                                                          @RequestBody NoteRequestDto dto){
        noteService.updateNote(noteId, dto);

        Map<String, Object> response = new HashMap<>();
        response.put("data", NoteUpdateResponseDto.builder().noteId(noteId).build());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "노트 상세 조회", description = "노트 ID를 통해 특정 노트의 상세 정보를 조회합니다.")
    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNote(@PathVariable Long noteId){
        NoteFeedDto noteFeedDto = noteService.getNoteFeedDtoById(noteId);

        return ResponseEntity.ok(noteFeedDto);
    }

    @Operation(summary = "내 노트 개수 조회", description = "로그인한 사용자가 작성한 전체 노트의 개수를 반환합니다.")
    @GetMapping("/note-count")
    public ResponseEntity<Long> getNotesByUserId(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUser().getUserId();
        Long count = noteService.getNotesByUserId(userId);
        return ResponseEntity.ok().body(count);
    }

    @Operation(summary = "태그별 노트 개수 조회", description = "로그인한 사용자가 작성한 노트를 태그 이름 기준으로 그룹화하여 개수를 반환합니다.")
    @GetMapping("/note-count-tag")
    public ResponseEntity<List<NoteTagDto>> getNotesByTag(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUser().getUserId();
        List<NoteTagDto> result = noteService.getNoteCountGroupedByTag(userId);
        return ResponseEntity.ok(result);
    }
}
