#!/usr/bin/env bash
# macOS / Linux / WSL 에서 실행하세요. (Windows CMD/PowerShell 전용이 아님)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="${ROOT}/.cache/apps-in-toss-examples"

echo "== Apps in Toss examples → granite build =="
echo "Work dir: ${WORK}"

mkdir -p "${ROOT}/.cache"
if [[ ! -d "${WORK}/examples" ]]; then
  git clone --depth 1 https://github.com/toss/apps-in-toss-examples.git "${WORK}"
fi

cd "${WORK}/examples"
if [[ ! -d node_modules ]]; then
  npm install --legacy-peer-deps
fi

npm run build

echo ""
echo "빌드 완료. 프로젝트 루트에서 .ait 파일을 찾아 보세요."
echo "(granite 설정에 따라 파일명·위치가 다를 수 있습니다.)"
find "${WORK}/examples" -maxdepth 2 -name "*.ait" 2>/dev/null || true
