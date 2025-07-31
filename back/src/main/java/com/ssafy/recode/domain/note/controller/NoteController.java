package com.ssafy.recode.domain.note.controller;

import com.ssafy.recode.domain.note.dto.request.NoteRequestDto;
import com.ssafy.recode.domain.note.entity.Note;
import com.ssafy.recode.domain.note.service.NoteService;
import com.ssafy.recode.global.wrapper.NoteResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(savedNote);
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

}
