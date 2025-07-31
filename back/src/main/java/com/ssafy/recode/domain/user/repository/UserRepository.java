package com.ssafy.recode.domain.user.repository;

import com.ssafy.recode.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByRecodeId(String recodeId);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    boolean existsByRecodeId(String recodeId);
    Optional<User> findByUserIdAndIsDeletedFalse(Long userId);
}
