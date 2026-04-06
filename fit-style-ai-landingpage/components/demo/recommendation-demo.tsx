"use client"

import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type BodyTypeOpt = { code: string; label_ko: string }

type OutfitSlot = { role: string; image_url: string | null }
type Outfit = {
  id: string
  name: string
  summary: string | null
  slots: OutfitSlot[]
}

export function RecommendationDemo() {
  const [bodyTypes, setBodyTypes] = useState<BodyTypeOpt[]>([])
  const [configError, setConfigError] = useState<string | null>(null)

  const [height, setHeight] = useState("175")
  const [weight, setWeight] = useState("70")
  const [bodyCode, setBodyCode] = useState("")
  const [gender, setGender] = useState<"M" | "F">("M")
  const [season, setSeason] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [resultError, setResultError] = useState<string | null>(null)
  const [bmi, setBmi] = useState<number | null>(null)
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      setConfigError(null)
      try {
        const res = await fetch(`${apiBase}/v1/config`)
        if (!res.ok) throw new Error(`config ${res.status}`)
        const data = await res.json()
        const list = data.body_types as BodyTypeOpt[]
        setBodyTypes(list)
        setBodyCode((prev) => prev || list[0]?.code || "")
      } catch {
        setConfigError(
          `API에 연결할 수 없습니다. ${apiBase} 에서 서버가 실행 중인지, NEXT_PUBLIC_API_URL이 맞는지 확인하세요.`,
        )
      }
    })()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResultError(null)
    setEmptyMessage(null)
    setOutfits([])
    setBmi(null)

    const height_cm = Number.parseInt(height, 10)
    const weight_kg = Number.parseFloat(weight)
    try {
      const res = await fetch(`${apiBase}/v1/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height_cm,
          weight_kg,
          body_type_code: bodyCode,
          gender,
          ...(season ? { season } : {}),
          limit: 3,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResultError(data.error?.message ?? "요청에 실패했습니다.")
        return
      }
      setBmi(data.bmi)
      if (data.outfits?.length === 0) {
        setEmptyMessage(data.message ?? "조건에 맞는 코디가 없습니다.")
        return
      }
      setOutfits(data.outfits as Outfit[])
    } catch {
      setResultError("네트워크 오류입니다. API 주소와 서버 상태를 확인하세요.")
    } finally {
      setLoading(false)
    }
  }

  const roleLabel: Record<string, string> = {
    TOP: "상의",
    BOTTOM: "하의",
    OUTER: "아우터",
    SHOES: "신발",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {configError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{configError}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            체형 정보 입력
          </CardTitle>
          <CardDescription>
            키·몸무게·체형을 입력하면 서버가 추천 코디(제품 컷 이미지)를 반환합니다. 쇼핑 링크는 포함되지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">키 (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min={130}
                  max={220}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">몸무게 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={30}
                  max={200}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>체형</Label>
                <Select value={bodyCode} onValueChange={setBodyCode} disabled={bodyTypes.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((b) => (
                      <SelectItem key={b.code} value={b.code}>
                        {b.label_ko} ({b.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>성별</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as "M" | "F")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">남성</SelectItem>
                    <SelectItem value="F">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>계절 (선택)</Label>
              <Select value={season || "none"} onValueChange={(v) => setSeason(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">지정 안 함</SelectItem>
                  <SelectItem value="SPRING">봄</SelectItem>
                  <SelectItem value="SUMMER">여름</SelectItem>
                  <SelectItem value="FALL">가을</SelectItem>
                  <SelectItem value="WINTER">겨울</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="rounded-full w-full sm:w-auto" disabled={loading || !bodyCode}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  추천 중…
                </>
              ) : (
                "코디 추천 받기"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {resultError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{resultError}</p>
      )}

      {emptyMessage && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">{emptyMessage}</p>
      )}

      {bmi != null && outfits.length > 0 && (
        <p className="text-sm text-muted-foreground">
          계산 BMI: <span className="font-medium text-foreground">{bmi}</span> (참고용)
        </p>
      )}

      <div className="space-y-8">
        {outfits.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle>{o.name}</CardTitle>
              {o.summary && <CardDescription>{o.summary}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {o.slots.map((s) => (
                  <div key={s.role} className="space-y-2">
                    <p className="text-xs text-muted-foreground text-center">{roleLabel[s.role] ?? s.role}</p>
                    <div className="aspect-[4/5] rounded-xl bg-muted overflow-hidden relative">
                      {s.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.image_url}
                          alt={roleLabel[s.role] ?? s.role}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2">
                          없음
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        본 결과는 스타일 참고용이며 의료·정밀 체형 분석이 아닙니다. 앱인토스 출시 시 면책·개인정보 문구를 반드시 넣으세요.
      </p>
    </div>
  )
}
