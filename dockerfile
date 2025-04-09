# 백엔드 빌드 스테이지
FROM node:18 AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server ./
# package.json에 build 스크립트 추가 필요
RUN npm run build || echo "Build script not found, please add 'build': 'tsc' to scripts"

# 프론트엔드 빌드 스테이지
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# 실행 스테이지
FROM node:18-alpine
WORKDIR /app

# 백엔드 설정
WORKDIR /app/server
COPY --from=backend-builder /app/server/dist ./dist
COPY --from=backend-builder /app/server/package*.json ./
RUN npm install --only=production

# 프론트엔드 설정
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package*.json ./
RUN npm install --only=production

# 시작 스크립트
WORKDIR /app
COPY start.sh ./
RUN chmod +x start.sh

# 백엔드와 프론트엔드 포트 설정
ENV BACKEND_PORT=8080
ENV FRONTEND_PORT=3000

# 두 포트 모두 노출
EXPOSE $BACKEND_PORT $FRONTEND_PORT

CMD ["./start.sh"]