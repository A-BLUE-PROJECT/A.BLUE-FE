# TASK: Phase 2 - Route Separation & Admin Orchestration

**ALLBLUE: AI Fashion Orchestration Platform**
**Focus:** Separate Layouts, Lookbook Inspector, and Infinite Gallery

---

## 1. 개요 (Overview)
Phase 2의 목표는 유저가 사용하는 **'안티그래비티 갤러리'**와 운영자가 사용하는 **'어드민 대시보드'**를 물리적으로 분리하고, AI 생성 콘텐츠의 승인 프로세스를 구축하는 것이다.

## 2. 프로젝트 구조 설계 (Route Groups)
Next.js의 Route Groups 기능을 사용하여 유저용 레이아웃과 어드민용 레이아웃을 분리한다.

- **`(main)` 폴더**: 유저용 페이지 (안티그래비티 레이아웃, 헤더/푸터 포함)
  - `app/(main)/page.tsx` (랜딩 페이지)
  - `app/(main)/gallery/page.tsx` (룩북 탐색 피드)
- **`(admin)` 폴더**: 운영자용 페이지 (데이터 중심의 깔끔한 대시보드 레이아웃)
  - `app/(admin)/admin/page.tsx` (대시보드 홈 - 통계 및 요약)
  - `app/(admin)/admin/inspect/page.tsx` (AI 룩북 검수 및 승인 화면)

## 3. 핵심 구현 요구사항

### 3.1. 운영자 검수 시스템 (The Inspector) - `/admin/inspect`
- **목적**: Gemini API로 생성된 `PENDING` 상태의 룩북을 검토하고 일반 유저에게 노출할지 결정한다.
- **UI 구성**: 
  - 데이터 그리드 또는 리스트 형태의 효율 중심 UI (무중력 효과 제외).
  - 각 항목에 `APPROVE(승인)` 및 `REJECT(반려)` 버튼 배치.
  - 클릭 시 룩북의 상세 조합(상품 리스트)을 확인할 수 있는 퀵 뷰 제공.
- **상태 전환**: 버튼 클릭 시 해당 데이터의 상태를 `PENDING` → `APPROVED`로 변경하는 API 호출 로직(Mock)을 구현한다.

### 3.2. 유저용 무한 갤러리 (The Gallery) - `/gallery`
- **목적**: 운영자가 승인한(`APPROVED`) 고퀄리티 룩북들을 탐색한다.
- **인터랙션**:
  - **Infinite Scroll**: `react-query`를 활용한 끊김 없는 스크롤 경험.
  - **Floating Interaction**: 각 카드는 마우스 호버 시 안티그래비티 컨셉에 맞춰 미세하게 떠오르거나 공전하는 애니메이션 적용.
  - **Fit Score Badge**: 유저 프로필과 매칭된 점수를 카드 상단에 부유하는 배지로 표시.

### 3.3. 카페24 실시간 연동 기초
- 룩북 내 개별 상품 클릭 시, 카페24 API를 통해 실시간 가격과 재고 상태를 가져오는 기초 인터페이스(Interface)를 설계한다.

## 4. 디자인 가이드라인
- **Admin**: 화이트 배경, 시스템 폰트, 명확한 그리드 시스템 (Efficiency First).
- **Main**: 블랙/화이트 대비, 대형 타이포그래피, 무중력 애니메이션 (Brand Experience First).

## 5. 최종 산출물
- `app/(main)/layout.tsx` & `app/(admin)/layout.tsx`
- `app/(admin)/admin/inspect/page.tsx`
- `components/admin/StatusToggle.tsx` (승인 전환 버튼 컴포넌트)
- `components/gallery/LookbookGrid.tsx`