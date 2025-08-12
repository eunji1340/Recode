package com.ssafy.recode.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoteNotFoundException extends RuntimeException{
    public NoteNotFoundException(Long noteId) {
        super("해당 noteId를 찾을 수 없습니다: " + noteId);
    }
}
