package com.ssafy.recode.domain.tag.entity;

import com.ssafy.recode.domain.note.entity.Note;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    @Column(unique = true)
    private String tagName;

    @Builder.Default
    @ManyToMany(mappedBy = "tags")
    private List<Note> notes = new ArrayList<>();

}
