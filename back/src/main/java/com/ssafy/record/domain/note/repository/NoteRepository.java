package com.ssafy.record.domain.note.repository;

import com.ssafy.record.domain.feed.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Like, Long> {}