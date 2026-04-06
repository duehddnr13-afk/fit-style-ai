# FitStyle AI (모노레포 구성)

## 구성

| 폴더 | 설명 |
|------|------|
| `fit-style-ai-api` | 추천·설정·관리자 API (Hono + Prisma + PostgreSQL) |
| `fit-style-ai-landingpage` | Next.js 랜딩 + `/demo`에서 API 연동 체험 |

## 앱 번들(zip) 만들기

프로젝트 **루트**(`ai 코디`)에서:

```bash
npm install
npm run bundle
```

- 결과: `release/fit-style-ai-app-bundle-날짜시간.zip` 및 같은 이름의 폴더
- 포함: `landing/`(Next standalone), `api/`(컴파일 결과 + prisma), `README-BUNDLE.txt`
- Windows에서는 대용량 복사에 `robocopy`, 압축에 `tar -a`를 사용합니다.

## 로컬에서 한 번에 쓰기

1. PostgreSQL 실행 후 `fit-style-ai-api`에서 `.env` 작성 → `npx prisma migrate deploy` → `npm run db:seed` → `npm run dev` (기본 포트 3001)
2. `fit-style-ai-landingpage`에 `.env.local` 생성:

   `NEXT_PUBLIC_API_URL=http://localhost:3001`

3. 랜딩 폴더에서 `npm run dev` → 브라우저에서 `/demo` 열기

## 앱인토스 `.ait` 번들

- **별도 폴더·도구**: `fit-style-ai-toss/README.md` 참고.  
- Granite 미니앱에서 `npm run build` 로 생성하며, **Windows에서는 `granite build`가 실패하는 경우가 있어** WSL/macOS/Linux 권장.  
- 스크립트: `scripts/build-ait-from-examples.sh` (Bash)

## 아직 이 저장소 밖에서 해야 하는 일

- 토스 **앱인토스** UI·SDK 연동 및 심사
- 프로덕션 배포(Vercel, AWS, GCP 등) 및 도메인
- 실제 제품 이미지·코디 데이터 입력(관리자 API 또는 DB)

자세한 API는 `fit-style-ai-api/docs/api-spec.yaml`, `fit-style-ai-api/README.md` 참고.
