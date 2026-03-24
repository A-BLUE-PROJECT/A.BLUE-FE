# TASK: Phase 1 - Anti-gravity Landing Page Implementation

**ALLBLUE: AI Fashion Orchestration Platform**
**Slogan:** "Mix Malls, Match Your Style"

---

## 1. 개요 (Overview)
본 작업은 ALLBLUE의 첫인상을 결정하는 랜딩 페이지의 히어로 섹션을 구축하는 것이다. 여러 쇼핑몰의 상품이 섞여 하나의 스타일로 완성되는 과정을 **안티그래비티(무중력)** 비주얼로 구현하여 서비스의 핵심 가치를 전달한다.

## 2. 기술 스택 (Tech Stack)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 3. 핵심 구현 요구사항

### 3.1. 무중력 조합 애니메이션 (Mix & Match Animation)
- **기본 상태**: 화면 진입 시, 개별 상품 이미지(Product Item)들은 무작위 좌표와 회전값을 가진 채 미세하게 부유(Floating)한다.
- **스크롤 인터랙션**: `useScroll`과 `useTransform`을 활용한다.
  - 스크롤 0% ~ 20%: 부유 상태 유지 및 패럴랙스 효과 극대화.
  - 스크롤 20% ~ 80%: 흩어져 있던 상품들이 중앙의 **Lookbook Card** 위치로 빨려 들어가며 정렬 및 합쳐짐.
  - 스크롤 80% ~ 100%: 완성된 룩북이 강조되며 슬로건 텍스트와 동기화됨.

### 3.2. 이미지 로딩 최적화 (Performance)
- **Next.js Image**: 모든 룩북 및 상품 이미지는 `next/image`를 사용하고 히어로 섹션 이미지는 `priority` 속성을 부여한다.
- **Pre-animation Check**: 모든 고해상도 이미지가 로드된 후 애니메이션이 시작되도록 관리한다.
  - `onLoadingComplete` 또는 `onLoad` 핸들러를 사용하여 상태를 관리할 것.
  - 로딩 중에는 매거진 감성의 세련된 **Skeleton** 또는 **Blur** 플레이스홀더를 노출한다.

### 3.3. 디자인 시스템 적용
- **Visual Style**: Minimal & High-Contrast (무채색 배경, 블랙 타이포그래피).
- **Layout**: 비대칭 매거진 그리드(Asymmetric Grid)와 대형 텍스트 마스킹 효과.

## 4. 데이터 구조 (Mock Data)
- `Lookbook` 엔티티와 그에 속한 `LookbookItem`(Product 정보 포함) 객체를 가상 데이터로 생성하여 구현에 사용한다.
- 각 상품에는 원본 쇼핑몰 정보(Brand Name)가 포함되어야 한다.

## 5. 최종 산출물
- `components/landing/HeroSection.tsx`
- `components/animation/OrchestrationContainer.tsx`
- `hooks/useGravityScroll.ts` (필요 시)