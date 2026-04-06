/**
 * FitStyle AI — 배포용 앱 번들(zip)
 * 실행: 프로젝트 루트에서 npm run bundle
 * ZIP: Windows 10+ 내장 tar -a (또는 시스템 tar)
 */
import { execFileSync, execSync, spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const apiDir = path.join(root, "fit-style-ai-api")
const landingDir = path.join(root, "fit-style-ai-landingpage")
const releaseDir = path.join(root, "release")
function stampNow() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}
const stamp = stampNow()
const bundleName = `fit-style-ai-app-bundle-${stamp}`
const outDir = path.join(releaseDir, bundleName)

function run(cmd, cwd) {
  execSync(cmd, { cwd, stdio: "inherit", env: process.env })
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

/** Windows 에서 fs.cpSync 대용량 시 프로세스 비정상 종료가 나는 경우가 있어 robocopy 사용 */
function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  if (os.platform() === "win32") {
    const r = spawnSync("robocopy", [src, dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/R:1", "/W:1"], {
      encoding: "utf8",
      windowsHide: true,
    })
    const code = r.status ?? 0
    if (code >= 8) {
      throw new Error(`robocopy 실패 (${code}): ${src} -> ${dest}\n${r.stderr || ""}`)
    }
  } else {
    fs.cpSync(src, dest, { recursive: true })
  }
}

function copyDir(src, dest) {
  copyTree(src, dest)
}

function zipFolderWithTar(sourceDirName, parentDir, outZip) {
  // tar -a -c -f out.zip -C parent sourceDirName
  execFileSync(
    "tar",
    ["-a", "-c", "-f", outZip, "-C", parentDir, sourceDirName],
    { stdio: "inherit", shell: false },
  )
}

console.log("== FitStyle AI app bundle ==")
console.log("Root:", root)

if (!fs.existsSync(apiDir)) throw new Error("fit-style-ai-api 폴더가 없습니다.")
if (!fs.existsSync(landingDir)) throw new Error("fit-style-ai-landingpage 폴더가 없습니다.")

console.log("\n[1/4] API 빌드 (tsc)...")
run("npm run build", apiDir)
if (!fs.existsSync(path.join(apiDir, "dist", "index.js"))) {
  throw new Error("API dist/index.js 가 없습니다.")
}

console.log("\n[2/4] 랜딩 Next.js standalone 빌드...")
run("npm run build", landingDir)

const standalone = path.join(landingDir, ".next", "standalone")
const staticDir = path.join(landingDir, ".next", "static")
if (!fs.existsSync(standalone)) {
  throw new Error(".next/standalone 이 없습니다. next.config.mjs 에 output: 'standalone' 확인.")
}
if (!fs.existsSync(staticDir)) {
  throw new Error(".next/static 이 없습니다.")
}

console.log("\n[3/4] 번들 폴더 복사...")
ensureDir(outDir)

const apiOut = path.join(outDir, "api")
ensureDir(apiOut)
copyDir(path.join(apiDir, "dist"), path.join(apiOut, "dist"))
fs.copyFileSync(path.join(apiDir, "package.json"), path.join(apiOut, "package.json"))
fs.copyFileSync(path.join(apiDir, "package-lock.json"), path.join(apiOut, "package-lock.json"))
copyDir(path.join(apiDir, "prisma"), path.join(apiOut, "prisma"))

const landingOut = path.join(outDir, "landing")
copyTree(standalone, landingOut)

const destNext = path.join(landingOut, ".next")
ensureDir(destNext)
copyDir(staticDir, path.join(destNext, "static"))

const publicDir = path.join(landingDir, "public")
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, path.join(landingOut, "public"))
}

const readme = `FitStyle AI — 앱 번들 (${stamp})
================================

포함물
------
- landing/ : Next.js standalone (node server.js)
- api/       : Hono API (dist + prisma)

사전 요구: Node.js 20+, PostgreSQL

landing 실행
------------
  cd landing
  set PORT=3000
  node server.js

api 실행
--------
  cd api
  npm ci --omit=dev
  npx prisma generate
  (.env 에 DATABASE_URL 등)
  npx prisma migrate deploy
  npm start

보안: .env 는 번들에 넣지 말고 서버에만 배치하세요.
`
fs.writeFileSync(path.join(outDir, "README-BUNDLE.txt"), readme, "utf8")

console.log("\n[4/4] ZIP 압축...")
ensureDir(releaseDir)
const zipPath = path.join(releaseDir, `${bundleName}.zip`)
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
zipFolderWithTar(bundleName, releaseDir, zipPath)

const mb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1)
console.log("\n완료:")
console.log("  폴더:", outDir)
console.log("  ZIP :", zipPath)
console.log("  크기:", mb, "MB")
