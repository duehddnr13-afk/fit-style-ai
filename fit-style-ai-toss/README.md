# FitStyle AI — 앱인토스 `.ait` 빌드 안내

`.ait` 파일은 **토스 Granite + `@apps-in-toss/framework`** 로 만든 **React Native 미니앱**을 빌드할 때만 생성됩니다.  
이 워크스페이스의 Next.js 랜딩·Node API 프로젝트와는 **별도 프로젝트**입니다.

## 지금 Windows에서 `.ait`가 안 나올 때 (우선순위)

로컬 `granite build`가 **`onResolve` / Go regular expression` / 경로 관련 오류**로 끊기면, Windows에서 esbuild 경로 처리 이슈인 경우가 많습니다. 아래 중 **하나만** 성공하면 됩니다.

### 1) GitHub Actions로 빌드 (추천, PC OS 무관)

1. 이 폴더가 들어 있는 프로젝트를 **GitHub 저장소**에 푸시합니다.  
2. GitHub → **Actions** → **Build Toss AIT (example)** 워크플로 → **Run workflow** 실행.  
3. 완료 후 **Artifacts**에서 `toss-ait-example` zip을 받습니다 → 압축 해제하면 **`.ait`** 가 들어 있습니다.

> 이 워크플로는 토스 공식 예제(`apps-in-toss-examples`)를 Linux에서 빌드합니다. **본인이 만든 미니앱**을 빌드하려면, 나중에 같은 방식으로 **본인 Granite 프로젝트**를 저장소에 넣고 `working-directory`·스크립트만 바꾸면 됩니다.

### 2) WSL2 (Ubuntu)

1. Microsoft Store에서 **Ubuntu** 설치 후 실행.  
2. 프로젝트를 **WSL 홈 안**으로 복사합니다 (경로에 한글·공백 최소화).

   `cp -r /mnt/c/Users/.../프로젝트 ~/fit-toss`

3. Node 20 설치 후, [방법 A](#방법-a--공식-스캐폴딩-권장)대로 `npm create granite-app` 또는 예제 클론 후 `npm install` → `npm run build`.

### 3) Mac 또는 다른 Linux PC

같은 저장소를 클론한 뒤 터미널에서 `npm run build` (Granite 프로젝트 루트).

---

## Windows에서 `granite build`가 실패할 때 (원인)

경로가 정규식 필터에 들어가면서 Windows 백슬래시·`\d` 등과 충돌하는 이슈가 보고됩니다. **로컬 Windows만 고집하지 말고** 위 1)~3)을 쓰는 것이 빠릅니다.

## 방법 A — 공식 스캐폴딩 (권장)

**대화형 터미널**(PowerShell / 터미널 앱)에서 프로젝트를 **영문 경로**에 만듭니다.  
예: `C:\dev\fit-style-ai-toss` 또는 WSL의 `~/work/fit-style-ai-toss`

```bash
npm create granite-app@latest
```

안내에 따라 앱 이름(kebab-case), 도구(biome / eslint+prettier) 선택 후:

```bash
cd <프로젝트폴더>
npm install @apps-in-toss/framework
npx ait init
```

`granite.config.ts`에서 `appName`, 브랜드(`displayName`, `primaryColor` 등)를 콘솔 앱과 맞춘 뒤 TDS 패키지 설치 등 [공식 튜토리얼](https://developers-apps-in-toss.toss.im/tutorials/react-native.html)을 따릅니다.

번들 생성:

```bash
npm run build
```

프로젝트 루트에 **`<서비스명>.ait`** 가 생깁니다.

## 방법 B — 예제 저장소로 빌드 (Linux / macOS / WSL)

저장소 루트의 `scripts/build-ait-from-examples.sh` 를 실행합니다.  
(`examples` 폴더에서 `npm install` 후 `npm run build` → `granite build`)

## 업로드

[앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/) 콘솔 → 앱 선택 → **앱 출시**에서 생성된 `.ait` 업로드.  
압축 해제 기준 **100MB 이하**입니다.

## 백엔드 API

FitStyle 추천 API는 **별도 서버에 HTTPS로 배포**한 뒤, 미니앱에서 해당 URL로 요청합니다. `.ait` 안에 API 서버 전체를 넣지 않습니다.
