package com.ssafy.recode.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component // Spring Bean으로 등록
@RequiredArgsConstructor
public class JwtTokenProvider {

    // application.yml 또는 .properties에서 주입받는 JWT 서명 키
    @Value("${jwt.secret}")
    private String secretKey;

    // AccessToken 유효기간: 15분
    private static final long ACCESS_TOKEN_VALIDITY = 1000L * 60 * 15;

    // RefreshToken 유효기간: 7일
    private static final long REFRESH_TOKEN_VALIDITY = 1000L * 60 * 60 * 24 * 7;

    /**
     * 토큰 생성 로직 (AccessToken, RefreshToken 공통 사용)
     * @param userId 토큰에 담을 사용자 식별자 (subject)
     * @param expireTime 만료 시간 (밀리초 단위)
     * @return 생성된 JWT 문자열
     */
    private String createToken(String userId, long expireTime) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expireTime);

        return Jwts.builder()
                .setSubject(userId) // 사용자 식별값 (예: recodeId)
                .setIssuedAt(now) // 토큰 발급 시간
                .setExpiration(expiry) // 만료 시간
                .signWith(
                        Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)), // 서명 키 설정
                        SignatureAlgorithm.HS256 // 서명 알고리즘
                )
                .compact(); // JWT 문자열로 반환
    }

    /**
     * JWT 파싱 및 Claims 추출
     * @param token JWT 문자열
     * @return 토큰에서 추출한 Claims (subject, iat, exp 등)
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))) // 검증용 키 설정
                .build()
                .parseClaimsJws(token) // 토큰 파싱 및 검증
                .getBody(); // Claims 반환
    }

    /**
     * AccessToken 발급 (15분 유효)
     * @param userId 사용자 식별자
     * @return AccessToken
     */
    public String createAccessToken(String userId) {
        return createToken(userId, ACCESS_TOKEN_VALIDITY);
    }

    /**
     * RefreshToken 발급 (7일 유효)
     * @param userId 사용자 식별자
     * @return RefreshToken
     */
    public String createRefreshToken(String userId) {
        return createToken(userId, REFRESH_TOKEN_VALIDITY);
    }

    /**
     * 토큰에서 사용자 ID(subject) 추출
     * @param token JWT
     * @return 토큰에 담긴 사용자 식별자
     */
    public String getUserId(String token) {
        return parseClaims(token).getSubject(); // subject가 userId 역할
    }

    /**
     * 토큰 유효성 검증
     * @param token JWT
     * @return 유효하면 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // 파싱 시 예외 없으면 유효
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 오류, 만료, 잘못된 형식 등 모두 여기서 처리됨
            return false;
        }
    }
}
