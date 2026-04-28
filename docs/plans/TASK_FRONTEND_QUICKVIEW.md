# TASK: Frontend Final - Quick View Modal & Admin Root

**ALLBLUE: AI Fashion Orchestration Platform**
**Focus:** Lookbook Quick View Modal (Deep-link ready) & Admin Root Route

---

## 1. 개요 (Overview)
프론트엔드 MVP의 마지막 단계로, 갤러리에서 개별 룩북을 클릭했을 때 상세 상품 정보를 보여주는 **'퀵뷰 모달(Quick View Modal)'**을 구현합니다. 또한, 누락된 `/admin` 루트 페이지를 생성하여 라우팅 오류를 방지합니다.

## 2. 핵심 구현 요구사항

### 2.1. 상품 퀵뷰 모달 (Quick View Modal)
- **기능**: 갤러리 피드(`LookbookGrid.tsx`)에서 특정 룩북 카드를 클릭하면 화면 위에 반투명(Glassmorphism) 모달이 열립니다.
- **UI 구성**:
  - **좌측/상단**: 클릭한 룩북의 메인 화보 이미지.
  - **우측/하단**: 해당 룩북을 구성하는 '개별 상품 리스트(상의, 하의, 신발 등)'.
  - **버튼**: 각 상품마다 **[원본 쇼핑몰에서 보기]** 버튼을 배치하여, 추후 카페24 딥링크로 연결될 수 있는 UI를 마련합니다.
- **상태 관리**: Zustand(`useUIStore.ts` 등)를 활용하여 모달의 열림/닫힘 상태와 '현재 선택된 룩북 데이터'를 전역으로 관리합니다.
- **데이터**: 아직 API가 없으므로 화면이 예쁘게 나오도록 Mock Data를 활용합니다.

### 2.2. 관리자 메인 대시보드 (`/admin/page.tsx`)
- **문제점**: 현재 `/admin/inspect` 경로는 존재하지만, 루트 경로인 `/admin` 접속 시 404 에러가 발생합니다.
- **해결책**: `src/app/(admin)/admin/page.tsx` 파일을 생성합니다.
- **구현 방식**: 
  - 방법 A: 간단한 환영 메시지와 함께 `/admin/inspect`로 이동하는 버튼이 있는 미니멀한 대시보드 UI 구현.
  - 방법 B: 접속 시 자동으로 `/admin/inspect`로 리다이렉트(Redirect) 처리. (둘 중 더 깔끔한 방식으로 에이전트가 선택하여 구현)

## 3. 작업 지침 및 스타일링
- **일관성**: 모달의 배경은 기존 `LoginModal`과 유사한 **블러 처리된 블랙/다크그레이(Glassmorphism)** 톤을 유지하여 '안티그래비티 매거진' 무드를 해치지 않아야 합니다.
- **반응형**: 모바일에서는 하단에서 올라오는 Bottom Sheet 형태, 데스크탑에서는 화면 중앙에 뜨는 팝업 형태로 자연스럽게 동작하도록 CSS(Tailwind)를 구성합니다.

## 4. 최종 산출물
- `components/gallery/QuickViewModal.tsx` (신규 생성)
- `components/gallery/LookbookGrid.tsx` (클릭 이벤트 및 Zustand 연동 수정)
- `store/useUIStore.ts` (Quick View 관련 상태 추가)
- `app/(admin)/admin/page.tsx` (신규 생성)