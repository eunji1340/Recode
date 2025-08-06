package com.ssafy.recode.domain.user;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {

    // Cookie 생성
    public static Cookie createHttpOnlyCookie(String name, String value, int days) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // HTTPS 환경에서는 true
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * days);
        return cookie;
    }


    // 쿠키에서 RefreshToken 추출
    public static String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null; // 해당 이름의 쿠키가 없을 경우
    }
//    // 배포 시 사용할 코드
//    public static void deleteCookie(HttpServletResponse response, String name) {
//        String cookieValue = name + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None";
//        response.addHeader("Set-Cookie", cookieValue);
//    }

    // 테스트 시 코드
    public static void deleteTestCookie(HttpServletResponse response, String name) {
        // Secure, SameSite 제거한 쿠키 삭제용 (HTTP 테스트 환경 전용)
        String cookieValue = name + "=; Path=/; Max-Age=0; HttpOnly";
        response.addHeader("Set-Cookie", cookieValue);
    }

//    // 배포시 사용할 코드
//    // Secure + HttpOnly + SameSite=None 쿠키 수동 설정
//    public static void addSameSiteCookie(HttpServletResponse response, String name, String value, int days) {
//        int maxAge = 60 * 60 * 24 * days;
//        String cookieValue = name + "=" + value +
//                "; Path=/" +
//                "; Max-Age=" + maxAge +
//                "; HttpOnly" +
//                "; Secure" +
//                "; SameSite=None";
//
//        response.addHeader("Set-Cookie", cookieValue);
//    }

    // 테스트 시 코드
    public static void addTestCookie(HttpServletResponse response, String name, String value, int days) {
        int maxAge = 60 * 60 * 24 * days;
        String cookieValue = name + "=" + value +
                "; Path=/" +
                "; Max-Age=" + maxAge +
                "; HttpOnly"; // Secure, SameSite 생략

        response.addHeader("Set-Cookie", cookieValue);
    }
}