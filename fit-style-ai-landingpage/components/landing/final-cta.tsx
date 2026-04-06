"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FinalCTA() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bodyType, setBodyType] = useState("")

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-balance">
                지금 무료로 스타일 분석 시작
              </h2>
              <p className="text-muted-foreground">
                간단한 정보만 입력하면 AI가 맞춤 코디를 추천해드려요
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">키 (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="rounded-xl h-12 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">체중 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-xl h-12 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>체형 선택</Label>
                <RadioGroup
                  value={bodyType}
                  onValueChange={setBodyType}
                  className="grid sm:grid-cols-3 gap-3"
                >
                  {[
                    { value: "slim", label: "마른 체형" },
                    { value: "average", label: "평균 체형" },
                    { value: "lower", label: "하체 발달" }
                  ].map((option) => (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-colors"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button size="lg" className="w-full rounded-xl h-14 text-base gap-2 group" asChild>
                <Link href="/demo">
                  AI 코디 추천 시작
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              무료로 시작하세요. 신용카드 필요 없음.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
