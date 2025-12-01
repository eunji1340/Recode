# Re:Code
<img width="228" height="75" alt="로고" src="https://github.com/user-attachments/assets/bf3432bb-9988-4e37-8029-310350178b90" />

백준 제출 기록을 연동하여
AI가 실패·성공 코드를 비교 분석하고
오답노트를 자동 생성하는 알고리즘 학습 SNS 서비스입니다.

# 주요 기능

## 제출 기록 연동 (Chrome Extension)

* 백준 제출 내역 자동 수집
* 성공/실패 코드, 제출 언어·시간 정보 파싱
* 브라우저 확장 기반 자동 동기화

## AI 오답노트 생성

* 성공 코드와 실패 코드 비교 분석
* 로직 오류, 시간복잡도 차이 등 자동 진단
* 문제 요약, 개선 방향, 리팩토링 포인트 문서화

## SNS 기반 피드

* 오답노트 공유 피드
* 좋아요, 댓글, 팔로우 기능 제공
* 다른 사용자의 오답 기록 열람 가능

## 마이페이지 및 활동 관리

* 작성한 오답노트 관리
* 좋아요·댓글 활동 조회
* 연속 작성일(Streak) 통계 제공
* 팔로잉/팔로워 관리

---

# 시스템 아키텍처

<img width="1200" src="https://github.com/user-attachments/assets/f81bd94f-dc60-4362-b0dc-6fedaa257593" />

**구성 요소**

* Chrome Extension: 제출 기록 자동 수집
* Frontend(React): UI 및 인터랙션
* Backend(Spring Boot): 사용자·피드·노트 처리
* MySQL: 주요 데이터 저장
* OpenAI GPT API: 코드 비교 분석
* Solved.ac API: 문제/태그 정보 등 연동
* Docker·AWS EC2: 서비스 운영 환경

---

# 분석 구조

Re:Code의 분석은 다음 세 단계로 구성됩니다.

### 1. 제출 데이터 수집

크롬 익스텐션이 제출 기록과 코드를 자동으로 수집합니다.

### 2. GPT 기반 비교 분석

성공/실패 제출 코드를 비교하여
오류 원인·복잡도 차이·개선 방향을 분석합니다.

### 3. 오답노트 생성

분석 결과를 바탕으로 오답노트를 자동 작성하여
피드에 게시할 수 있는 형태로 제공합니다.

---

# Frontend 구조

```
src/
 ┣ api/           # axios API 모듈
 ┣ hooks/         # 공통 로직 (무한스크롤, 팔로우 등)
 ┣ components/    # 카드, UI 공통 컴포넌트
 ┣ pages/         # Feed, Explore, MyPage, NoteDetail
 ┣ stores/        # Zustand 상태 관리
 ┣ utils/         # 포맷터·헬퍼
 ┣ assets/        # 이미지·폰트
 ┗ router/        # 라우트 설정
```

---
# 화면 구성

## 메인 피드
<table>
<tr>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/05e6a91b-9436-4137-8c15-9bba6f4c1b8a" /></td>
</tr>
</table>

## 탐색 페이지
<table>
<tr>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/dd9126d4-d388-40c7-a100-e449c0722d30" /></td>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/690d35fe-688d-47af-acc4-f00d09e65833" /></td>
</tr>
</table>

## AI 오답노트 생성
<table>
<tr>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/b53c5184-e836-4ad6-9a65-192baaae12d9" /></td>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/9163ef8f-0147-450a-9224-2cbf8c609763" /></td>
</tr>
</table>

## 마이페이지
<table>
<tr>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/e0474219-ca1c-49a0-872e-1a7fdab42072" /></td>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/16e1a4af-6c01-4996-bc49-f2b6ee5fe036" /></td>
</tr>
<tr>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/46671836-0fa8-4a79-8d8f-bd4abf3548c0" /></td>
  <td align="center"><img width="600" src="https://github.com/user-attachments/assets/4ae78bc2-6fb8-4789-97f8-2943b7987586" /></td>
</tr>
</table>

---

# 기술 스택

## Frontend

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=Z&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)

## Backend

![Java](https://img.shields.io/badge/Java_21-007396?style=for-the-badge&logo=OpenJDK&logoColor=white)
![SpringBoot](https://img.shields.io/badge/SpringBoot_3-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

## AI

![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)

## Infra

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white)

---

# 팀 역할

<table>
  <tr>
    <th>이름</th><th>역할</th><th>담당 업무</th>
  </tr>
  <tr>
    <td>김수연</td>
    <td>Backend</td>
    <td>백엔드 구조 설계, EC2 DB 세팅, 회원·피드 API 개발</td>
  </tr>
  <tr>
    <td>박정현</td>
    <td>Backend</td>
    <td>배포, Spring Security + JWT 인증/인가, 토큰 검증</td>
  </tr>
  <tr>
    <td>오유진</td>
    <td>Backend</td>
    <td>오답노트 생성, Selenium 제출 기록 크롤링, GPT API 분석</td>
  </tr>
  <tr>
    <td>이아영</td>
    <td>Frontend</td>
    <td>FE 구조 설계·배포, Chrome Extension 연동, 노트 생성/상세 페이지 개발</td>
  </tr>
  <tr>
    <td>장은지</td>
    <td>Frontend</td>
    <td>메인 피드·탐색 페이지, 검색·정렬·무한스크롤 로직, 마이페이지 탭 일부 개발</td>
  </tr>
  <tr>
    <td>한영균</td>
    <td>Frontend</td>
    <td>JWT 로그인/사용자 인증, 회원가입, Sidebar·Dashboard 개발, 영상 제작</td>
  </tr>
</table>

---

# 실행 방법

## Frontend

```
cd frontend
npm install
npm run dev
```

## Backend

```
cd backend
./gradlew build
./gradlew bootRun
```

## Chrome Extension

Chrome → 확장 프로그램 → 개발자 모드 → "압축해제된 확장 프로그램 로드"

---

# 일정

| 기간    | 내용                        |
| ----- | ------------------------- |
| 1주차   | 기획 및 요구사항 정의              |
| 2~3주차 | FE/BE 핵심 기능 개발            |
| 4~5주차 | Chrome Extension 및 GPT 연동 |
| 6주차   | 통합 테스트 · 리팩토링             |
| 7주차   | 배포 및 문서 정리                |
