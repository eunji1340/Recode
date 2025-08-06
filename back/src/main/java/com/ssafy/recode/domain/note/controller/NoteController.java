package com.ssafy.recode.domain.note.controller;

import com.ssafy.recode.auth.CustomUserDetails;
import com.ssafy.recode.domain.note.dto.request.AiNoteRequestDto;
import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
import com.ssafy.recode.domain.note.dto.response.AiNoteResponseDto;
import com.ssafy.recode.domain.note.dto.response.NoteDeleteResponseDto;
import com.ssafy.recode.domain.note.dto.response.NoteFeedDto;
import com.ssafy.recode.domain.note.dto.response.NoteUpdateResponseDto;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.service.NoteService;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-key")
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequestDto dto,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        Note savedNote = noteService.createNote(dto, userId);
        return ResponseEntity.ok(NoteFeedDto.from(savedNote));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        NoteResponseWrapper response = noteService.getNotes(page, size);
        Map<String, Object> body = Map.of("data", response);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/ai-generate")
    public ResponseEntity<AiNoteResponseDto> generateAiNote(
            @RequestBody AiNoteRequestDto dto) {

        AiNoteResponseDto response = noteService.generateAiNote(dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long noteId){
        noteService.deleteNote(noteId);

        Map<String, Object> response = new HashMap<>();
        response.put("data", NoteDeleteResponseDto.builder().noteId(noteId).build());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<Map<String, Object>> updateNote(@PathVariable Long noteId,
                                                          @RequestBody NoteRequestDto dto){
        noteService.updateNote(noteId, dto);

        Map<String, Object> response = new HashMap<>();
        response.put("data", NoteUpdateResponseDto.builder().noteId(noteId).build());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNote(@PathVariable Long noteId){
        NoteFeedDto noteFeedDto = noteService.getNoteFeedDtoById(noteId);

        return ResponseEntity.ok(noteFeedDto);
    }

    @GetMapping("/note-count")
    public ResponseEntity<Long> getNotesByUserId(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUser().getUserId();
        Long count = noteService.getNotesByUserId(userId);
        return ResponseEntity.ok().body(count);
    }
}
