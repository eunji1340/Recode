package com.ssafy.recode.config;

import com.ssafy.recode.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration // 스프링 설정 클래스로 등록
@EnableWebSecurity // Spring Security 활성화
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // JWT 인증을 수행할 필터 (직접 구현한 클래스)
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Spring Security의 필터 체인을 정의하는 메서드
     * - 인증 방식
     * - 세션 정책
     * - URL 접근 제어
     * - JWT 필터 적용
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // HTTP Basic 인증 비활성화 (ID/PW 창 비표시)
                .httpBasic(AbstractHttpConfigurer::disable)

                // CSRF 보호 비활성화 (JWT는 서버에 상태를 저장하지 않으므로 필요 없음)
                .csrf(AbstractHttpConfigurer::disable)

                // 기본 CORS 설정 적용
                .cors(Customizer.withDefaults())

                // 세션 사용하지 않도록 설정 (JWT 기반이므로 STATELESS)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 요청별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 로그인, 회원가입, 토큰 재발급은 인증 없이 접근 허용
                        .requestMatchers("/users/login", "/users/register", "/users/reissue",
                                "/users/bojId_check", "/users/recodeId_dupcheck",
                                "/users/nickname_dupcheck", "/users/email_dupcheck",
                                "/swagger-ui/**", "/swagger-ui.html", "/swagger-resources/**", "/v3/api-docs/**",
                                "/solvedac/suggestion", "/", "/index"
                        ).permitAll()
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 등록
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build(); // SecurityFilterChain Bean 반환
    }
    /**
     * 비밀번호 암호화에 사용할 빈 등록
     * - BCrypt는 보안상 안전한 해시 함수
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager 빈 등록
     * - 로그인 시 AuthenticationProvider를 호출해 인증 수행
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
