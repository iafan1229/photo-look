# 개발자 이하영 포트폴리오 - Photo Look 

## 🌐 서비스 바로가기

**[링크](http://ec2-13-124-209-182.ap-northeast-2.compute.amazonaws.com/)**

## 📸 프로젝트 개요

**Photo Look**은 사용자가 업로드한 사진을 AI가 분석하여 자동으로 스토리텔링 형식의 카드 매거진으로 변환하는 서비스입니다.

## 🚀 아키텍쳐 (이미지 업로드 프로세스)

![아키텍쳐](https://photo-look-bucket.s3.ap-northeast-2.amazonaws.com/magazine-images/09a28683-5a8c-42a5-837d-1f7e651bdcae.png)

## 🎯 핵심기능 요약

- **AI 기반 자동화**: Google Vision AI와 Gemini를 활용한 지능형 이미지 분석 및 텍스트 생성
- **사용자 경험 중심**: 복잡한 편집 과정 없이 원클릭으로 완성되는 포토 매거진
- **개인화된 스토리텔링**: 각 사진의 특성을 분석하여 맞춤형 내러티브 제공

## 🛠 기술스택

### 프론트엔드

- **Next.js**: API rewrites를 통한 백엔드 프록시, 커스텀 훅을 활용한 상태 관리, 클라이언트 사이드 렌더링
- **SCSS + Ant Design**: 일관된 UI 컴포넌트 사용 / 필요시 SCSS로 모듈화 및 커스터마이징

### 백엔드 & AI Integration

- **아키텍처**: Layered Architecture
- **디자인 패턴**: Repository Pattern + Service Layer Pattern
- **Google Vision AI**: 정확한 이미지 라벨링 및 객체 인식
- **Google Gemini**: 창의적이고 자연스러운 스토리텔링 텍스트 자동 생성

### 인프라

- **MongoDB + AWS S3**: 안정적인 데이터 저장 및 이미지 관리
- **GitHub Actions**: 자동화된 CI/CD 파이프라인
- **AWS EC2 + Nginx**: 프로덕션 레벨 배포 환경

## 🎨 개발자로서의 성장 포인트

### 1. 풀스택 개발 역량

- 프론트엔드부터 백엔드, 인프라까지 전체 개발 생명주기 경험
- AI 서비스 통합을 통한 최신 기술 트렌드 적용

### 2. 사용자 중심 사고

- 복잡한 기술을 간단한 UX로 추상화하는 능력
- 실제 사용자 니즈를 충족하는 서비스 설계

### 3. 현대적 개발 워크플로우

- GitHub Issue 기반 프로젝트 관리
- CI/CD를 통한 자동화된 배포 프로세스

## 📈 내가 생각하는 이 프로젝트의 임팩트란

이 프로젝트는 **AI 시대의 콘텐츠 창작**의 가능성을 보여줍니다. 사진을 의미 있는 스토리로 변환하고,
사진으로 기록된 추억을 재미있게 재해석합니다.

---

_본 프로젝트는 저의 Javacscript 개발 경험을 바탕으로, AI와 저의 기술구현이 결합된 포트폴리오 작품입니다._
