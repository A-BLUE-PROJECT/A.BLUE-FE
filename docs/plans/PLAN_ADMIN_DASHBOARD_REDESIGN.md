# PLAN: Admin Curation Dashboard Redesign (SaaS & Magazine Style)

## 1. 개요 (Overview)
기존의 단순 검수 페이지를 넘어, 고퀄리티 생성형 AI 룩북을 다루기에 적합한 **SaaS(Software as a Service) 형태의 2-Column 구조**로 관리자 전용 큐레이션 대시보드를 전면 재설계한다. 
레퍼런스(Gentone.ai)의 명확하고 직관적인 UI 패턴(다크 헤더 + 라이트 컨트롤 패널, 액션 포인트 컬러)을 A.BLUE의 Anti-gravity 무드에 맞춰 변형하여 적용한다. 백엔드 API가 완성되기 전, 프론트엔드 단독으로 사이클(필터링 -> 검수 -> 승인/반려)을 완벽히 시뮬레이션 할 수 있도록 구축한다.

---

## 2. 레이아웃 및 디자인 시스템 적용 가이드

### 2.1. 전역 테마 분리 (유저 vs 관리자)
- **어드민 헤더**: 유저 사이트의 투명(Glassmorphism) 헤더와 차별화되도록, **솔리드 다크(Dark Solid) 헤더**를 채택하여 관리자 모드임을 즉각적으로 인지하게 함.
- **작업 캔버스**: 눈의 피로도를 낮추고 이미지 몰입도를 높이는 연한 회색(`#F5F5F5` 등) 배경 위에, 미세한 그림자(`shadow-sm`)와 라운드(`rounded-2xl`)가 적용된 화이트 카드를 띄움. 반중력(Anti-gravity) 개념의 연장선으로 요소가 살짝 떠있는 듯한 뎁스를 줌.

### 2.2. 좌승우반(2-Column) 뷰포트 구조
- **Left Sidebar (30%) - Filter & Controls**: 조건 필터링, 정렬, 작업 현황 컨트롤을 모아둔 고정 너비(Fixed Width) 사이드바.
- **Right Canvas (70%) - Preview & Action**: 필터된 룩북들의 결과 갤러리 뷰 및 선택된 룩북의 액션(승인/반려)이 일어나는 메인 작업 공간. 스크롤이 자체적으로 발생해야 함.

---

## 3. 핵심 컴포넌트 및 기능 요구사항

### 3.1. 좌측 사이드바 패널 (Filters)
- **상태(Status) 탭**: `ALL`, `PENDING (검수 대기)`, `APPROVED (승인됨)`, `REJECTED (반려됨)` 을 모아볼 수 있는 세그먼티드 컨트롤. (기본값: `PENDING`)
- **퀄리티(AI Score) 슬라이더**: 슬라이더를 통해 AI 매칭 스코어 n점 이상만 추려내어 하이퀄리티 룩북 집중 검수 지원.
- **정렬(Sort)**: 최신순, 스코어 높은순/낮은순 기준 정렬 드롭다운.

### 3.2. 우측 검수 캔버스 (Gallery & Review)
- **그리드 목록 (Grid View)**: 리뷰 대기 중인 이미지들이 비대칭(Masonry) 혹은 정형화된 그리드 카드로 펼쳐짐. 
  - 각 카드 상단 모서리에 `PENDING` 등 현재 상태를 알리는 오버레이 배지 부착.
- **상세 검수 뷰 (Detail Review Mode)**: 목록에서 특정 룩북 클릭 시,
  1. 원본 해상도 룩북 이미지
  2. 프롬프트 및 사용된 카페24 연동 상품 정보
  3. 시각적으로 강조된 대형 **[APPROVE(승인)]** 및 서브 **[REJECT(반려)]** 플로팅 액션 버튼 묶음 노출.

---

## 4. 백엔드 연동 전 프론트엔드 시뮬레이션 전략 (Zustand Mocking)
백엔드 단의 검수 목록 조회 및 상태 변경 API가 준비될 때까지 기다리지 않고, 지연 시간을 가진 Promise를 활용하여 실제와 100% 동일한 흐름을 구축한다.

1. **상태 모델링 (Store)**: `useAdminStore`에 다수의(50~100개) 더미 룩북 객체(`status: 'PENDING'`)를 선언.
2. **필터 동작**: 좌측 사이드바 변경 시 상태 관리 스토어의 데이터가 실시간으로 우측 그리드 결과물로 반영됨 필터 로직 작성.
3. **상태 변경 액션**: 유저가 **[APPROVE(승인)]** 버튼 클릭 시 잠시 로딩(스피너)를 띄운 후, 프론트엔드 Store의 해당 아이템 상태를 변경하고 `PENDING` 리스트에서 즉각적으로 제거되는 애니메이션(Framer Motion Exit Animation) 구현.

---

## 5. 최종 산출 대상 폴더 구조 (예정)

```text
src/
 ┣ app/
 ┃ ┗ admin/
 ┃   ┗ curation/
 ┃     ┗ page.tsx               # 2-Column 레이아웃 컨테이너
 ┣ components/
 ┃ ┗ admin/
 ┃   ┣ CurationSidebar.tsx      # 필터/설정 영역 패널 컴포넌트
 ┃   ┣ CurationCanvas.tsx       # 룩북 그리드 결과물 영역 컴포넌트
 ┃   ┣ ReviewDetailModal.tsx    # 승인/반려 액션이 일어나는 상세 뷰 모델
 ┃   ┗ AdminHeader.tsx          # 관리자용 다크 솔리드 헤더
 ┗ store/
   ┗ useAdminStore.ts           # 상태 관리 및 더미 검수 시뮬레이터
```
