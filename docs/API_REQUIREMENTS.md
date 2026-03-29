# ALLBLUE API Requirements (Frontend Integration)

프론트엔드 기능을 실제 백엔드와 연동하기 위해 필요한 API 명세서입니다. 

---

## 1. 인증 및 사용자 (Auth & User)
- **POST `/adm/v1/auth/login`**
  - **설명**: 관리자 로그인
  - **필수 전송 데이터**: `email`, `password`
  - **동작**: 성공 시 `admin_access_token` 쿠키 설정 필요.
- **GET `/v1/auth/me`**
  - **설명**: 현재 유저 정보 및 권한 확인 (ADMIN/USER 등급 판별)
- **POST `/v1/auth/refresh`**
  - **설명**: JWT 토큰 갱신 로직
- **GET `/v1/auth/oauth2/google`**
  - **설명**: 구글 소셜 로그인 진입 (Landing Header 'LOG IN' 버튼 연합)

## 2. 메인 서비스 (Gallery & Lookbook)
- **GET `/v1/lookbooks`**
  - **설명**: 승인된(APPROVED) 룩북 목록 조회
  - **요구사항**: 페이지네이션(Limit/Offset) 및 카테고리 필터링 지원 필요
- **GET `/v1/lookbooks/{id}`**
  - **설명**: 룩북 상세 조회 (Quick View 모달용)
  - **응답 항목**: 타이틀, 이미지 URL, AI 스코어, 연관 카페24 상품 정보(ID, 이름, 가격, 썸네일)

## 3. 어드민 관리 (Admin Curation)
- **GET `/adm/v1/lookbooks`**
  - **설명**: 모든 상태(PENDING/APPROVED/REJECTED)의 룩북 목록 상세 조회
- **PATCH `/adm/v1/lookbooks/{id}/status`**
  - **설명**: 룩북 검수 상태 변경 (Pending -> Approved/Rejected)
- **GET `/adm/v1/products`**
  - **설명**: 카페24 연동된 전체 상품 마스터 리스트 조회
- **POST `/adm/v1/products/sync`**
  - **설명**: 카페24 최신 상품 데이터 동기화 강제 요청

## 4. AI 생성 (Generator)
- **POST `/adm/v1/generator/lookbook`**
  - **설명**: AI 룩북 생성 수동 요청
  - **필수 데이터**: `prompt`, `ratio`(1:1, 3:4, 9:16), `referenceImageUrl`, `productIds[]`
  - **응답**: 생성된 결과 이미지 URL 또는 비동기 처리를 위한 Task ID

---

## 5. 데이터 모델 (참고용)

```typescript
// Lookbook
interface Lookbook {
  id: string;
  title: string;
  imageUrl: string;
  aiScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  relatedProducts: Product[];
}

// Product (Cafe24 연동)
interface Product {
  productId: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  detailUrl: string;
}
```

**업데이트 일자**: 2026-03-30
**작성자**: Antigravity (AI Assistant)
