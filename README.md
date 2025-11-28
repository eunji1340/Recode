<img width="1313" height="861" alt="아키텍처" src="https://github.com/user-attachments/assets/00294882-9675-46b8-93bd-704bbc1eb6d8" /># Re:Code – AI 기반 알고리즘 오답노트 SNS

![Frontend](https://img.shields.io/badge/React-19-61DAFB?style=flat\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat\&logo=typescript)
![SpringBoot](https://img.shields.io/badge/SpringBoot-3.5.3-6DB33F?style=flat\&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat\&logo=mysql)
![GPT](https://img.shields.io/badge/OpenAI-GPT--4.1-412991?style=flat\&logo=openai)
![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-v1.0-4285F4?style=flat\&logo=googlechrome)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=flat\&logo=docker)

---

# 1. 프로젝트 소개

**Re:Code**는 BOJ 백준 제출 기록을 연동하여
**AI가 실패·성공 코드를 비교 분석하고 오답노트를 자동 생성하는 알고리즘 학습 SNS 서비스**입니다.

* 반복되는 오답 분석 시간을 줄이고
* 수동 기록 없이 자동으로 회고하며
* 타인의 오답노트와 코드 분석을 SNS처럼 공유/소통할 수 있습니다.

📆 **개발 기간:** 2025.07 ~ 2025.08
👥 **팀 구성:** Frontend 3 · Backend 3
🏷 **프로젝트명:** A507 – Re:Code

---

# 2. 주요 기능

## 🔌 2-1. Chrome Extension 기반 BOJ 제출 기록 연동

* 백준 로그인 쿠키 자동 추출
* 제출 목록 자동 수집
* 성공/실패 코드, 제출 언어, 제출 시간 수집
  ➡ UX 개선 / 수동 입력 오류 제거

## 🤖 2-2. GPT API를 활용한 오답노트 자동 생성

* 성공 코드 VS 실패 코드 구조 비교
* 시간복잡도/로직 오류 분석
* 개선 방향 / 리팩토링 포인트 자동 제시
* 문제 요약·실패 원인 등을 자동 문서화

## 📰 2-3. 알고리즘 기반 SNS 피드

* 오답노트 피드 업로드
* 좋아요 ❤️·댓글 💬·팔로우 ➕
* 타인의 오답노트 열람 및 코드 비교

## 👤 2-4. 마이페이지 & 활동 분석

* 작성한 오답노트 관리
* 좋아요한 글·댓글 기록 조회
* 활동 통계(연속 작성일 Streak)
* 팔로우/팔로잉 정보 확인

---

# 3. 시스템 아키텍처
<img width="1313" height="861" alt="아키텍처" src="https://github.com/user-attachments/assets/f81bd94f-dc60-4362-b0dc-6fedaa257593" />


### 아키텍처 설명

* AWS EC2 기반 Docker 컨테이너에서 FE/BE/DB 각각 독립 운영
* Frontend는 Axios 기반 REST API로 Backend와 통신
* Backend는 Spring Boot + JPA 기반으로 MySQL 연동
* Chrome Extension이 백준 제출 기록 크롤링 후 Backend로 전송
* GPT API가 코드 비교 분석 및 오답노트 자동 생성
* Solved.ac API로 문제 난이도/태그/플레이어 정보 연동

---

# 4. 기술 스택

## 🟦 Frontend

* **React 19, Vite, TypeScript, Zustand, Tailwind CSS**
* Axios 기반 API 클라이언트
* IntersectionObserver 기반 무한 스크롤
* 컴포넌트 구조화 / 공통 피드 렌더링 로직 개발

## 🟩 Backend

* Spring Boot 3.5.3, Spring Security + JWT
* JPA/Hibernate, MySQL, Redis
* GPT 연동 서비스 / 제출 기록 파서 / 사용자 인증

## 🟧 Infra

* Docker / Docker Compose
* AWS EC2
* Nginx Reverse Proxy

## 🟪 Chrome Extension

* 백준 제출 기록 자동 수집
* 쿠키 기반 로그인 연동

## 🟫 AI

* OpenAI GPT API
* 코드 비교·분석 프롬프트 엔지니어링

---

# 5. 프로젝트 구조 (FE)

```
src/
 ┣ api/               # axiosInstance, feed/user/note API 모듈
 ┣ hooks/             # useInfiniteFeeds, useFollow, useLike 등 공통 로직
 ┣ components/        # UI, FeedCard, SearchBox, UserCard 등
 ┣ pages/             # FeedPage, ExplorePage, MyPage, NoteDetailPage
 ┣ stores/            # Zustand 전역 상태 관리
 ┣ utils/             # date formatting, API 데이터 맵핑
 ┣ assets/            # 폰트/이미지
 ┗ router/            # 라우터 선언
```

---

# 6. 화면 구성 미리보기

### 🖥 메인 피드

<img width="1411" height="775" alt="피드보기" src="https://github.com/user-attachments/assets/05e6a91b-9436-4137-8c15-9bba6f4c1b8a" />

### 🔍 탐색 페이지

<img width="1418" height="770" alt="탐색" src="https://github.com/user-attachments/assets/dd9126d4-d388-40c7-a100-e449c0722d30" />
<img width="1424" height="770" alt="노트상세" src="https://github.com/user-attachments/assets/690d35fe-688d-47af-acc4-f00d09e65833" />


### 📝 AI 오답노트 생성

<img width="1434" height="772" alt="노트생성_문제검색" src="https://github.com/user-attachments/assets/b53c5184-e836-4ad6-9a65-192baaae12d9" />
<img width="2856" height="1533" alt="노트생성_AI생성" src="https://github.com/user-attachments/assets/9163ef8f-0147-450a-9224-2cbf8c609763" />


### 👤 마이페이지

<img width="1418" height="773" alt="마이페이지_대시보드" src="https://github.com/user-attachments/assets/e0474219-ca1c-49a0-872e-1a7fdab42072" />
<img width="1418" height="770" alt="마이페이지_팔로워" src="https://github.com/user-attachments/assets/16e1a4af-6c01-4996-bc49-f2b6ee5fe036" />
<img width="1429" height="774" alt="마이페이지_댓글" src="https://github.com/user-attachments/assets/46671836-0fa8-4a79-8d8f-bd4abf3548c0" />
<img width="1430" height="768" alt="마이페이지_설정" src="https://github.com/user-attachments/assets/4ae78bc2-6fb8-4789-97f8-2943b7987586" />


---

# 7. 팀 역할
## 🟦 Frontend

### **장은지 (FE)**

* 메인 피드(FeedPage) / 탐색 페이지(ExplorePage) 개발 전담
* 검색·정렬·무한 스크롤 통합 피드 공통 로직 구현
* 마이페이지 Notes/Likes/Comments 탭 UI 개발

### **이아영 (팀장, FE)**

* FE 초기 구조 설계, 배포
* Chrome Extension 연동
* 노트 생성 / 상세 페이지 개발
* 브랜치 전략 및 FE 코드 관리

### **한영균 (FE)**

* JWT 로그인 / 사용자 인증
* 회원가입 / Sidebar / Dashboard 개발
* 프로젝트 영상 포트폴리오 제작

---

## 🟩 Backend

### 김수연

* 백엔드 구조 설계
* EC2 환경 DB 세팅
* 회원·피드 API 개발

### 박정현

* Backend 배포
* Spring Security + JWT 인증/인가
* 토큰 발급·검증 로직 구현

### 오유진

* 오답노트 생성 기능 개발
* Selenium 기반 제출 기록 크롤링
* GPT API 코드 분석 처리

---

# 8. 실행 방법 (로컬)

### 🔧 1) 프론트엔드 실행

```
cd frontend
npm install
npm run dev
```

### 🔧 2) 백엔드 실행

```
cd backend
./gradlew build
./gradlew bootRun
```

### 🔧 3) Chrome Extension 로드

* `src/api/manifest.json`이 있는 폴더를 크롬 확장 프로그램 → 개발자 모드 → “압축해제된 확장 프로그램 로드”로 등록

---

# 9. 일정

| 기간    | 내용                     |
| ----- | ---------------------- |
| 1주차   | 기획 · 요구사항 정의 · 아키텍처 설계 |
| 2~3주차 | FE/BE 주요 기능 개발         |
| 4~5주차 | 크롬 익스텐션 & GPT 연동       |
| 6주차   | 통합 테스트 · 리팩토링          |
| 7주차   | 배포 및 마무리               |

---
