# ALLBLUE Frontend Session Summary

**날짜:** 2026.04.05

---

## 📝 작업 요약

Admin 페이지 전 영역의 Mock 데이터를 실제 BE API로 교체 완료. 갤러리·QuickView(이전 세션 완료)에 이어 Admin Products, Inspect, Curation 페이지까지 연동하여 FE-BE 통합 연동을 마무리했습니다.

---

## 🚀 주요 변경 사항

### 1. Admin Inspect 페이지 실연동 (`src/app/(admin)/hq/inspect/page.tsx`)

하드코딩된 3개 더미 룩북을 제거하고 실제 API로 교체.

- `GET /adm/v1/lookbooks?status=PENDING` 호출로 PENDING 룩북 목록 로딩
- 배열 / cursor page 두 응답 형식 모두 처리 (`Array.isArray` 분기)
- `LookbookResponse.tags` (comma-separated string) → `aiTags[]` 배열 변환
- `StatusToggle`에 `onDone={() => remove(lb.id)}` 연결 — 승인/반려 후 카드 즉시 제거
- 로딩 스피너 추가

### 2. Admin Curation — useAdminStore 실연동 (`src/store/useAdminStore.ts`)

50개 더미 데이터 생성기 제거 후 실제 API 연동.

| 항목 | 변경 내용 |
|---|---|
| `id` 타입 | `string` → `number` (BE 스펙 일치) |
| `fetchLookbooks()` | `GET /adm/v1/lookbooks?status=` 호출, filterStatus가 ALL이면 param 없이 전체 조회 |
| `setFilterStatus()` | 상태 변경 시 자동 재조회 + `selectedLookbookId` 초기화 |
| `updateLookbookStatus()` | `PATCH /adm/v1/lookbooks/{id}/approve|reject` 실호출 + 낙관적 업데이트 + 실패 시 롤백 |
| `Lookbook` 타입 | `relatedProducts` 제거, `LookbookResponse` 기반 `AdminLookbook`으로 재정의 |

### 3. CurationCanvas 실연동 (`src/components/admin/CurationCanvas.tsx`)

- 마운트 시 `fetchLookbooks()` 호출
- 룩북 선택 시 `GET /adm/v1/lookbooks/{id}` (detail) 별도 fetch → `LookbookDetailResponse.items` 기반으로 연결 상품 표시
- `handleAction` mock setTimeout 제거 → store `updateLookbookStatus()` 직접 호출
- 로딩 스피너 추가 (목록 로딩 / 상품 상세 로딩 각각)

---

## 🔍 BE API 응답 형식 확인

curl 테스트를 통해 실제 응답 구조 검증 완료.

**래퍼 구조** — 모든 API 공통
```json
{ "code": "SPD20001", "message": "...", "data": <실제 데이터> }
```

**`data` 타입별 차이**
| API | data 타입 |
|---|---|
| `GET /adm/v1/products` | `AdminProduct[]` (배열 직접) |
| `GET /adm/v1/lookbooks?status=PENDING` | `AdminLookbook[]` (배열 직접) |
| `GET /w/v1/lookbooks` | `{ items: [], hasNext: false }` (cursor page) |

→ `apiClient`가 `.data`를 반환하므로 FE 코드 변경 불필요.

---

## 🔑 어드민 계정 비밀번호 리셋

기존 bcrypt 해시의 원본 비밀번호 불명 → DB 직접 업데이트.

```
이메일: admin@allblue.com
비밀번호: Test1234!
```

> ⚠️ 로컬 개발용 비밀번호. 운영 배포 전 반드시 교체 필요.

---

## 📂 변경 파일 목록

```
src/app/(admin)/hq/inspect/page.tsx     ← 수정 (mock → 실API)
src/store/useAdminStore.ts              ← 수정 (mock → 실API)
src/components/admin/CurationCanvas.tsx ← 수정 (mock → 실API)
```

---

## 🔗 연동 완료 API 전체 목록

| Method | Path | 페이지/컴포넌트 |
|---|---|---|
| `GET` | `/w/v1/lookbooks` | 갤러리 LookbookGrid (infinite scroll) |
| `GET` | `/w/v1/lookbooks/{id}` | QuickViewModal |
| `GET` | `/adm/v1/products` | Admin Products |
| `PATCH` | `/adm/v1/products/{id}/hidden` | Admin Products (SHOW/HIDE) |
| `GET` | `/adm/v1/lookbooks?status=PENDING` | Admin Inspect |
| `PATCH` | `/adm/v1/lookbooks/{id}/approve` | Admin Inspect / Curation |
| `PATCH` | `/adm/v1/lookbooks/{id}/reject` | Admin Inspect / Curation |
| `GET` | `/adm/v1/lookbooks` | Admin Curation |
| `GET` | `/adm/v1/lookbooks/{id}` | Admin Curation (detail) |
| `GET` | `/adm/v1/models?gender=` | Generator Sidebar |
| `POST` | `/adm/v1/lookbooks/generate` | Generator |
| `POST` | `/adm/v1/auth/login` | Admin Login |

---

## ❌ 아직 연동 안 된 항목

| 항목 | 현황 |
|---|---|
| `GeneratorSidebar` Product Mapping | `MOCK_CAFE24_PRODUCTS` 사용 중 → `GET /adm/v1/products` 교체 필요 |
| `oauth2/redirect/page` | `/`로 리다이렉트만 함, JWT 쿠키 처리 미구현 |

---

## ⏭️ 다음 세션 작업

### 🔴 1순위 — Gemini E2E 파이프라인 검증
rate limit 해제 후 단건 테스트:
```
POST /adm/v1/lookbooks/generate
→ n8n Webhook
→ Gemini (models/gemini-2.5-flash-image)
→ Save Image
→ POST /i/v1/lookbooks/{id}/complete
→ 갤러리 노출 확인
```

### 🟡 2순위 — Generator Product Mapping 실연동
`useGeneratorStore`에서 `MOCK_CAFE24_PRODUCTS` 제거 → `useProductStore.fetchProducts()` 재활용

### 🟡 3순위 — OAuth2 redirect 처리
`/oauth2/redirect` 페이지에서 BE가 심어주는 JWT 쿠키 확인 후 처리 로직 구현

---

## 🌐 현재 환경

| 항목 | 값 |
|---|---|
| 백엔드 포트 | `8080` |
| 프론트엔드 포트 | `3000` |
| n8n 포트 | `5678` |
| 어드민 계정 | `admin@allblue.com` / `Test1234!` |
| DB | PostgreSQL 16 (로컬 설치) |
| Redis | Docker (`allblue-redis`) |
| n8n | Docker (`allblue-n8n`) |
