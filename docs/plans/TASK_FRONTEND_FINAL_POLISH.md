# TASK: Frontend Final Polish (Visual & Magazine Layout)

**ALLBLUE: AI Fashion Orchestration Platform**
**Focus:** AI Synergy Orbit Badge, Magazine Typography, and Asymmetric Grid

---

## 1. 개요
백엔드 연동 전, 프론트엔드의 비주얼 폴리싱을 완료한다. (기존 기획의 유저 체형 프로필 입력 기능은 UX 허들을 낮추기 위해 MVP에서 제외함)

## 2. 핵심 구현 요구사항

### 2.1. AI 시너지 오빗 배지 (AI Synergy Orbit Badge)
- **개념**: 룩북 상세 페이지나 갤러리 카드에서, AI가 평가한 '코디 조합 완성도(예: 98%)'를 보여주는 UI 컴포넌트 개발. 
- **인터랙션**: 점수 배지가 모델 주위를 위성처럼 빙빙 도는(Orbit) 공전 애니메이션을 Framer Motion으로 구현하여 시각적 재미를 극대화한다.

### 2.2. 매거진 스타일 고도화 (Typography & Grid)
- **타이포그래피 마스킹**: 메인 텍스트 뒤로 이미지가 겹치거나 마스킹되는 런웨이 컨셉의 시각 효과를 적용한다.
- **비대칭 그리드**: 갤러리 피드(`app/(main)/gallery/page.tsx`)에 카드의 크기와 배치가 불규칙한 그리드(Asymmetric Grid)를 적용하여 실제 패션 잡지 화보를 보는 듯한 레이아웃을 완성한다.

## 3. 작업 지침
- 모든 애니메이션은 안티그래비티(무중력) 테마의 일관성을 유지할 것.
- 프로필 관련 페이지 및 상태 관리 로직은 작성하지 않는다.