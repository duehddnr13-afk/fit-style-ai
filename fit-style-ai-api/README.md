# FitStyle AI API

키·몸무게·체형 기반 코디 추천(JSON). 제품 단독 컷 이미지 URL만 반환합니다.

## 요구 사항

- Node.js 20+
- PostgreSQL 16+ (로컬은 `docker compose up -d`)

## 설정

`.env.example`을 복사해 `.env`를 만듭니다.

- `DATABASE_URL` — PostgreSQL 연결 문자열
- `ADMIN_API_KEY` — (선택) 8자 이상. 설정 시 `GET/POST/PATCH/DELETE /v1/admin/items`, `/v1/admin/outfits` 사용. `Authorization: Bearer <키>` 또는 `X-Admin-Key: <키>`

## DB

```bash
npx prisma migrate deploy
npm run db:seed
```

## 실행

```bash
npm install
npm run dev
```

- 헬스: `GET http://localhost:3001/health`
- 설정(체형 목록): `GET http://localhost:3001/v1/config`
- 추천: `POST http://localhost:3001/v1/recommendations` (본문은 `docs/api-spec.yaml` 참고)

## 문서

- OpenAPI: `docs/api-spec.yaml`

## 완료 후 체크 (운영 전)

- [ ] 프로덕션 `DATABASE_URL`, `ADMIN_API_KEY` 분리 저장(비밀 관리)
- [ ] CORS `origin: "*"` 를 도메인 화이트리스트로 변경
- [ ] HTTPS(리버스 프록시 또는 호스팅)
- [ ] 토스 앱인토스에서 호출할 API 베이스 URL 고정 및 심사 문구(면책·개인정보)
