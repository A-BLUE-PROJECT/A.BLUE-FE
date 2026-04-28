# ALLBLUE Session Summary

**날짜:** 2026.04.12

---

## 📝 작업 요약

1. Gemini 룩북 생성 E2E 파이프라인을 완성했고
2. 그 과정에서 n8n 워크플로우를 `googleGemini` 네이티브 노드 기반으로 전면 재작성했으며
3. Generator 사이드바의 상품 매핑을 목데이터에서 실제 API로 교체했고
4. OAuth2 redirect 처리가 이미 구현돼 있음을 확인했으며
5. 룩북 승인 → 갤러리 노출 E2E 검증을 완료하고
6. 크롤링 시절 잔재인 AI 검수 단계를 스킵하도록 BE를 수정했다.

---

## 🚀 주요 변경 사항

### 1. n8n 워크플로우 재작성 — `ALLBLUE Lookbook Generator` (`9VFEUTECNmvzP74J`)

이전 구조는 Code 노드에서 `process.env.GEMINI_API_KEY`로 Gemini REST API를 직접 호출하는 방식이었는데, n8n Task Runner 샌드박스는 `process` 글로벌을 노출하지 않아 `process is not defined` 로 실패했다. Credentials를 그대로 활용할 수 있는 네이티브 노드 기반으로 전환.

**최종 노드 토폴로지**
```
Webhook1 (POST /outfit-filter)
   ├─→ Respond Immediately1            (202 즉시 응답)
   └─→ Prepare Inputs (Code v2)
         └─→ Google Gemini Edit Image
               ├─(success)→ Save Image1 → Complete Callback1
               └─(error)  → Fail Callback1
```

**Prepare Inputs (Code v2)** — slot을 model / TOP / BOTTOM 3개로 단순화

- `process.env` 제거, `require('https'|'http')` 로 이미지 바이너리 다운로드
- `localhost:8080` → `host.docker.internal:8080` 치환 (Docker 컨테이너에서 호스트 접근)
- 3개 바이너리를 `model` / `top` / `bottom` 이름으로 다음 노드에 전달
- style/season/gender 맵핑으로 한국어 프롬프트 합성

**Google Gemini Edit Image** (`@n8n/n8n-nodes-langchain.googleGemini` v1.1)

```json
{
  "resource": "image",
  "operation": "edit",
  "modelId": { "value": "models/gemini-2.5-flash-image" },
  "prompt": "={{ $json.prompt }}",
  "images": {
    "values": [
      { "binaryPropertyName": "model" },
      { "binaryPropertyName": "top" },
      { "binaryPropertyName": "bottom" }
    ]
  },
  "options": { "binaryPropertyOutput": "image" }
}
```

크레덴셜은 `googlePalmApi` 타입(`Google Gemini(PaLM) Api account 2`) 사용. API 키 방식이라 사전 권한 설정 없이 동작.

**Save Image1** (`n8n-nodes-base.readWriteFile` v1.1)

```
/home/node/lookbook-output/lookbook-{{ $('Prepare Inputs').first().json.lookbookId }}.{{ $binary.image.fileExtension }}
```

---

### 2. n8n 파일 쓰기 차단 이슈 해결 — `docker-compose.yml`

`readWriteFile` 노드가 `The file "..." is not writable.` 로 계속 실패. OS 권한/바인드 마운트는 정상이었고, n8n 소스(`n8n-core/.../file-system-helper-functions.js`의 `isFilePathBlocked()`)를 읽어본 결과 **`SecurityConfig.restrictFileAccessTo` 기본값이 `~/.n8n-files` 라는 allowlist** 로 설정되어 있어 다른 모든 경로가 막혀 있었다.

`A.BLUE-BE/docker-compose.yml` n8n 서비스 env에 허용 경로를 추가:

```yaml
n8n:
  environment:
    - GENERIC_TIMEZONE=Asia/Seoul
    - TZ=Asia/Seoul
    - GEMINI_API_KEY=${GEMINI_API_KEY}
    - NODE_FUNCTION_ALLOW_BUILTIN=https,http,url,buffer
    - N8N_RESTRICT_FILE_ACCESS_TO=/home/node/lookbook-output   # ← 추가
```

`docker compose up -d n8n` 으로 재생성 후 즉시 해결.

---

### 3. E2E 단건 검증 — lookbookId=5

```
POST /adm/v1/lookbooks/generate
  payload: tmp_generate.json
  (CASUAL/SPRING/WOMEN, TOP=22, BOTTOM=25)
→ 202 SLB20201 { data: 5 }
→ n8n execution 58 status=success (28.5s)
→ Lookbook Generated/lookbook-5.png (1,704,737 bytes)
→ POST /i/v1/lookbooks/5/complete
→ DB status=COMPLETED, imageUrl=/images/lookbooks/lookbook-5.png, aiScore=85
```

파이프라인 전 구간 그린.

> **참고** — 작업 중 폴더에서 "깨진 이미지"가 보였던 건 진단 과정에서 `docker exec ... touch` 로 만든 0바이트 더미 파일(`test.txt`, `lookbook-99.png`). 실제 Gemini 바이트가 파일시스템에 닿은 건 이번이 처음.

---

### 4. Generator Product Mapping 실연동

**문제:** `GeneratorSidebar.tsx`가 `MOCK_CAFE24_PRODUCTS`를 import해서 상품 리스트를 더미로 렌더링하고 있었음. 반면 `useGeneratorStore`에는 이미 `products` / `loadProducts` / `isLoadingProducts` 구현이 존재했음 (이전 세션에서 store만 먼저 전환해둔 상태).

**수정** (`src/components/admin/GeneratorSidebar.tsx`):

- `MOCK_CAFE24_PRODUCTS` import 제거
- store에서 `products`, `loadProducts`, `isLoadingProducts` 구독
- 마운트 시 `loadModels(targetGender)` 와 함께 `loadProducts()` 호출
- 리스트 렌더링에 로딩/빈 상태 분기 추가

`useGeneratorStore.loadProducts()`는 이미 `GET /adm/v1/products` 를 호출하여 `AdminProduct[]` 를 받아, `hidden === false && stockStatus !== 'OUT_OF_STOCK'` 로 필터하고 `GeneratorProduct` 로 매핑한다.

---

### 5. OAuth2 redirect — 이미 구현 완료 확인

이전 세션 요약에 "JWT 쿠키 처리 미구현"으로 기재돼 있었으나, 코드 검토 결과 이미 전부 구현돼 있었다.

- **BE `OAuth2SuccessHandler`**: Google OAuth 성공 시 `access_token` / `refresh_token` HttpOnly 쿠키 세팅 후 FE `/oauth2/redirect`로 302 리다이렉트
- **FE `/oauth2/redirect/page.tsx`**: error 파라미터 체크 → `fetchMe()` 호출 → 성공 시 `/`로, 실패 시 에러 메시지와 함께 `/`로 리다이렉트
- **FE `apiClient`**: `credentials: 'include'` 기본 적용 → 쿠키 자동 전송

추가 구현 불필요.

---

### 6. 룩북 승인 → 갤러리 노출 E2E 검증

```
POST /adm/v1/lookbooks/generate → lookbookId=1
→ n8n → Gemini → Save Image → Complete Callback
→ DB: COMPLETED, inspection: AI_PASSED
→ PATCH /adm/v1/lookbooks/1/approve → APPROVED
→ GET /w/v1/lookbooks → 갤러리에 정상 노출 확인
```

---

### 7. AI 검수 스킵 — `ImageInspection.createAsPassed()`

**배경**: `ImageInspection`은 원래 크롤링 이미지의 AI 안전성 검수를 위한 도메인이었으나, Gemini 생성 룩북에는 불필요. 기존 흐름은 `PENDING → (AI 콜백) → AI_PASSED → (관리자) → ADMIN_APPROVED` 였는데, AI 콜백 단계가 n8n 워크플로우에 없어서 inspection이 `PENDING`에서 멈추고 관리자 승인이 불가능했다.

**수정**:
- `ImageInspection.java` — `createAsPassed()` 팩토리 메서드 추가 (생성 시 바로 `AI_PASSED`)
- `LookbookCommandService.java` — `complete()`에서 `create()` → `createAsPassed()` 변경

→ 관리자가 Inspect 페이지에서 곧바로 승인/거절 가능.

---

## 📂 변경 파일 목록

```
A.BLUE-BE/docker-compose.yml                                              ← N8N_RESTRICT_FILE_ACCESS_TO 추가
A.BLUE-BE/src/.../admin/domain/model/ImageInspection.java                 ← createAsPassed() 추가
A.BLUE-BE/src/.../lookbook/application/LookbookCommandService.java        ← create() → createAsPassed()
A.BLUE-FE/src/components/admin/GeneratorSidebar.tsx                       ← Mock → store.products 실연동
n8n workflow 9VFEUTECNmvzP74J                                             ← 전면 재작성 (네이티브 Gemini 노드)
```

---

## ✅ 이전 세션 미완료 항목 해소 현황

| 항목 | 결과 |
|---|---|
| Gemini E2E 파이프라인 검증 | ✅ 완료 — generate → Gemini → save → complete → approve → 갤러리 노출 |
| Generator Product Mapping 실연동 | ✅ 완료 — MOCK_CAFE24_PRODUCTS 제거, store.loadProducts() 사용 |
| OAuth2 redirect 처리 | ✅ 이미 구현돼 있었음 (stale 기록) |
| FAILED lookbook 정리 | ✅ DB 초기화로 자연 해결 |
| AI 검수 스킵 | ✅ createAsPassed() 적용 (BE 재시작 필요) |

---

## 🌐 현재 환경

| 항목 | 값 |
|---|---|
| 백엔드 포트 | `8080` |
| 프론트엔드 포트 | `3000` |
| n8n 포트 | `5678` |
| 어드민 계정 | `admin@allblue.com` / `Test1234!` |
| Gemini 모델 | `models/gemini-2.5-flash-image` (paid billing) |
| n8n 이미지 출력 경로 | `/home/node/lookbook-output` → `C:/Users/Windows10/Desktop/A.BLUE/Lookbook Generated` |
