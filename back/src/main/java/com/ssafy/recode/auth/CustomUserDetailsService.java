package com.ssafy.recode.auth;

import com.ssafy.recode.domain.user.entity.User;
import com.ssafy.recode.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // 스프링 빈으로 등록
@RequiredArgsConstructor // final 필드를 생성자 주입으로 처리
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // 사용자 정보를 조회할 Repository

    /**
     * Spring Security에서 사용자 인증 시 호출되는 메서드
     * @param recodeId 사용자 로그인 ID (recodeId)
     * @return UserDetails 객체 (Spring Security에서 인증 객체로 사용)
     * @throws UsernameNotFoundException 사용자를 찾을 수 없을 때 발생
     */
    @Override
    public UserDetails loadUserByUsername(String recodeId) throws UsernameNotFoundException {
        // recodeId로 사용자 조회. 없으면 예외 발생
        User user = userRepository.findByRecodeId(recodeId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + recodeId));

        // 조회된 User 엔티티를 UserDetails 형태로 감싸서 반환
        return new CustomUserDetails(user);
    }
}
