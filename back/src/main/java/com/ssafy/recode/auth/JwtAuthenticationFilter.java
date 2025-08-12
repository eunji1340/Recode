package com.ssafy.recode.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor // final 필드에 대한 생성자 자동 생성
@Component // Spring Bean 등록
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider; // JWT 생성 및 검증 도구
    private final CustomUserDetailsService userDetailsService; // 사용자 조회용 커스텀 서비스

    /**
     * 요청이 올 때마다 실행되는 필터의 핵심 로직
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 로그인 및 토큰 재발급 요청은 JWT 인증 없이 통과
        if (path.startsWith("/users/login") || path.startsWith("/users/reissue")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 요청 헤더에서 토큰 추출
        String accessToken = resolveTokenFromHeader(request);

        // 토큰이 존재하고 유효한 경우
        if (StringUtils.hasText(accessToken) && jwtTokenProvider.validateToken(accessToken)) {
            // 토큰에서 사용자 ID 추출
            String userId = jwtTokenProvider.getUserId(accessToken);

            // 사용자 ID로 유저 정보를 로드 (DB 조회)
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

            // 스프링 시큐리티 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

            // 시큐리티 컨텍스트에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청 헤더에서 JWT 토큰을 추출하는 메서드
     * Authorization: Bearer [token] 형식에서 토큰 부분만 잘라냄
     */
    private String resolveTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거
        }
        return null; // 유효한 토큰이 없으면 null 반환
    }
}
