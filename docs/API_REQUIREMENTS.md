# ALLBLUE API Specification (Official)

백엔드(`A.BLUE`) 프로젝트의 실제 구현을 바탕으로 작성된 공식 API 명세서입니다. 모든 요청은 `http://localhost:8080`을 베이스 URL로 하며, 프론트엔드 `apiClient`를 통해 연동됩니다.

---

## 1. 관리자 도메인 (Admin) - `/adm/v1`

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/auth/login` | 관리자 로그인 (admin_access_token 쿠키 발급) | ✅ 구현됨 |
| POST | `/auth/logout` | 관리자 로그아웃 (쿠키 삭제) | ✅ 구현됨 |
| GET | `/models` | AI 생성용 모델 이미지 리스트 조회 | ✅ 구현됨 |
| POST | `/lookbooks/generate` | AI 룩북 생성 요청 (비동기 처리) | ✅ 구현됨 |
| GET | `/lookbooks` | 전체 룩북 리스트 조회 (status 필터 가능) | ✅ 구현됨 |
| PATCH | `/lookbooks/{id}/approve` | 룩북 검수 승인 (공개 피드 노출) | ✅ 구현됨 |
| PATCH | `/lookbooks/{id}/reject` | 룩북 검수 거절 | ✅ 구현됨 |
| DELETE | `/lookbooks/{id}` | 룩북 삭제 | ✅ 구현됨 |
| GET | `/products` | 카페24 동기화 상품 목록 조회 | ✅ 구현됨 |
| PATCH | `/products/{id}/hidden` | 상품 노출/숨김 제어 | ✅ 구현됨 |

## 2. 일반 사용자 도메인 (Web) - `/w/v1`

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/lookbooks` | 공개된 룩북 피드 조회 (Cursor Pagination) | ✅ 구현됨 |
| GET | `/lookbooks/{id}` | 룩북 상세 정보 및 연관 상품 조회 | ✅ 구현됨 |
| POST | `/auth/refresh` | JWT 액세스 토큰 갱신 | ✅ 구현됨 |
| POST | `/auth/logout` | 웹 사용자 로그아웃 | ✅ 구현됨 |
| GET | `/oauth2/authorization/{provider}` | 소셜 로그인 진입 (google, kakao 등) | ✅ 구현됨 |

## 3. 셀러 및 연동 도메인 (Seller/Internal)

| Method | Endpoint | Description | Domain |
|--------|----------|-------------|--------|
| GET | `/s/v1/oauth/authorize` | 카페24 셀러 인증 페이지 리다이렉트 | Seller |
| GET | `/s/v1/oauth/callback` | 카페24 인증 코드 수신 및 토큰 저장 | Seller |
| POST | `/i/v1/lookbooks/{id}/complete` | AI 생성 완료 콜백 (Internal) | Internal |
| POST | `/i/v1/products/batch` | 상품 대량 등록/동기화 (Batch) | Internal |

---

## 🛠️ 데이터 모델 (참고)

### ApiResponse<T>
```json
{
  "code": "SUCCESS",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": { ... }
}
```

### CursorPage<T>
```json
{
  "content": [ ... ],
  "cursor": 123,
  "size": 20,
  "hasNext": true
}
```

**최종 업데이트**: 2026-03-30
**작성자**: Antigravity (Backend Source Verified)
