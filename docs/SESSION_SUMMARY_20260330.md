# ALLBLUE Frontend Task Walkthrough

**날짜:** 2026.03.30

---

## 📝 작업 요약

백엔드 모델 이미지 선택 API 연동 및 AI 룩북 생성 실연동을 위한 Generator 페이지 전면 개편 작업을 완료하였습니다.

---

## 🚀 주요 변경 사항

### 1. API 클라이언트 기반 구축

`src/lib/apiClient.ts` 를 신규 생성하여 백엔드(`localhost:8080`)와의 HTTP 통신을 위한 공통 유틸리티를 마련했습니다.

- `credentials: 'include'` 옵션으로 어드민 쿠키 자동 첨부
- `get / post / patch / delete` 메서드 제공
- 에러 응답 시 메시지 파싱 후 `Error` throw

### 2. Generator 스토어 실연동 전환

`src/store/useGeneratorStore.ts` 의 목업 로직을 실제 API 호출로 교체했습니다.

| 항목 | 변경 내용 |
| :--- | :--- |
| `loadModels(gender)` | `GET /adm/v1/models?gender=WOMEN\|MEN` 호출로 모델 이미지 목록 조회 |
| `generate()` | `POST /adm/v1/lookbooks/generate` 호출로 실제 룩북 생성 요청 |
| 상태 추가 | `styleType / season / targetGender / selectedModelUrl / generateError` |
| 상품 타입 수정 | `productId: string` → `productId: number` + `position` 필드 추가 (백엔드 스펙 맞춤) |

### 3. GeneratorSidebar 모델 선택 UI 추가

`src/components/admin/GeneratorSidebar.tsx` 에 모델 선택 섹션을 신설했습니다.

- **WOMEN / MEN 탭** — 탭 전환 시 해당 성별 모델 이미지를 API에서 실시간 로딩
- **모델 썸네일 그리드** (4열) — 선택 시 테두리 하이라이트 및 체크 표시
- **Style / Season 드롭다운** 추가 (캐주얼·포멀·스트릿·스포티 / 봄·여름·가을·겨울)
- Generate 버튼 활성 조건을 **모델 선택 + 상품 1개 이상** 으로 강화

### 4. GeneratorCanvas 비동기 생성 플로우 반영

`src/components/admin/GeneratorCanvas.tsx` 를 AI 파이프라인의 비동기 특성에 맞게 개편했습니다.

- 기존 가짜 완성 이미지 대신 **AI 대기 중 상태** 화면으로 교체
- 생성 중 화면에 선택된 모델 이미지 미리보기 표시
- 생성 완료 시 `Lookbook #ID` 및 매핑된 상품 목록 표시
- 검수 대시보드(`/hq/curation`) 바로가기 버튼 추가
- 에러 상태 UI 신규 추가

---

## 🛠️ 검증 결과

- `npm run build` 타입 오류 없이 정상 통과
- 모델 미선택 시 Generate 버튼 비활성화 동작 확인
- 백엔드 미기동 시 에러 상태 UI 정상 노출 확인

---

## 📂 변경 파일 목록

```
src/lib/apiClient.ts                          ← 신규
src/store/useGeneratorStore.ts                ← 수정
src/components/admin/GeneratorSidebar.tsx     ← 수정
src/components/admin/GeneratorCanvas.tsx      ← 수정
```

---

## 🔗 연동 백엔드 API

| Method | Path | 설명 |
| :--- | :--- | :--- |
| `GET` | `/adm/v1/models?gender=WOMEN\|MEN` | 모델 이미지 목록 조회 |
| `POST` | `/adm/v1/lookbooks/generate` | 룩북 생성 요청 (비동기) |
