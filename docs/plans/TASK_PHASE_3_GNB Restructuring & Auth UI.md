# TASK: Phase 3 - GNB Restructuring & Auth UI (Modern Magazine Style)

**ALLBLUE: AI Fashion Orchestration Platform**
**Focus:** Modern Header Layout, Login Modal, and Route Protection

---

## 1. 개요 (Overview)
우측 상단의 애매한 네비게이션 구조를 **'모던 매거진 스타일(좌측 로고 + 우측 텍스트)'**로 전면 개편한다. 또한, 사용자 진입을 위한 반투명 소셜 로그인 모달과 관리자 페이지 보안(Route Guard)을 구축한다.

## 2. 핵심 구현 요구사항

### 2.1. 글로벌 네비게이션 바(GNB) 개편 (모던 매거진 레이아웃)
- **구조 변경**: 기존 우측의 `gallery` 텍스트를 제거하고, 시선 흐름에 최적화된 좌/우 양극단 배치로 레이아웃을 정돈한다.
- **배치 가이드**:
  - **Left**: `ALLBLUE` 텍스트 로고 (브랜드 아이덴티티 강조)
  - **Right**: `LOG IN` 텍스트 버튼과 `MENU` 텍스트(또는 심플한 미니멀 아이콘) 배치.
- **스타일링**: 스크롤 시 배경이 블러 처리되는 Glassmorphism 헤더를 적용하여 안티그래비티 무드를 유지한다.

### 2.2. 인증 UI (Login Modal)
- **User Login UI**: 우측 상단의 `LOG IN` 클릭 시, 페이지 이동 없이 현재 화면 위에 부드럽게 나타나는 반투명(Glassmorphism) 스타일의 소셜 로그인 모달을 구현한다.
- **상태 관리**: 모달의 열림/닫힘 상태는 Zustand를 사용하여 전역에서 관리한다.

### 2.3. 어드민 라우트 보호 (Admin Guard)
- **접근 통제**: Next.js Middleware를 활용하여 로그인하지 않은 사용자가 `/admin` 하위 경로로 접근할 경우 메인 페이지(`/`)로 리다이렉트 처리한다.

## 3. 최종 산출물
- `components/layout/Header.tsx` (GNB 좌/우 레이아웃 개편)
- `components/auth/LoginModal.tsx`
- `middleware.ts` (보안 설정)