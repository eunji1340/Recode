# 배포용 dockerfile 
# [1단계] 빌드 
# 1. build 환경 설정
# node.js 22 lts img  
FROM node:22-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치 (package.json, package-lock.json 복사)
COPY package*.json ./
RUN npm install

# 4. source code copy
COPY . .

# 5. vite app build 
RUN npm run build

# [2단계] 배포 
# 6. nginx로 빌드된 정적 파일 서빙 
FROM nginx:alpine

# (필요시) nginx 설정 파일 복사 
# 프론트 라우팅 (react router) 위해 try_files 설정 포함을 권장 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. 빌드된 파일을 nginx 기본 웹서버 경로로 복사 
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. nginx 기본 포트 노출
EXPOSE 80

# 9. Nginx 포어그라운드에서 실행 
CMD [ "nginx", "-g", "daemon off;" ]