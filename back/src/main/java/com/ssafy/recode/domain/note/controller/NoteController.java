package com.ssafy.recode.domain.note.controller;

import com.ssafy.recode.domain.note.dto.request.AiNoteRequestDto;
import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
import com.ssafy.recode.domain.note.dto.response.*;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.service.NoteService;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequestDto dto,
                                        @RequestHeader("userId") Long userId) {
        Note savedNote = noteService.createNote(dto, userId);
        return ResponseEntity.ok(NoteFeedDto.from(savedNote));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotes(
            @RequestHeader("userId") Long userId,
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

}
