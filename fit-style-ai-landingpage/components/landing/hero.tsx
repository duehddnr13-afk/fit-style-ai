"use client"

import Link from "next/link"
import { ArrowRight, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-sm text-muted-foreground tracking-wide">
                AI 스타일링
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-balance">
              내 체형에 맞는
              <br />
              완벽한 코디를
              <br />
              찾아보세요
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-md">
              키·몸무게·체형만 입력하면 맞춤 코디를 제품 컷 이미지로 보여 드립니다
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8 gap-2 group" asChild>
                <Link href="/demo">
                  무료 코디 추천 받기
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/demo">스타일 미리보기</Link>
              </Button>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-2 pt-4">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-border" />
              <div className="h-2 w-2 rounded-full bg-border" />
            </div>
          </div>

          {/* Right Content - Result Preview */}
          <div className="relative">
            <div className="relative bg-card rounded-3xl p-6 shadow-sm border border-border/50">
              {/* Browser dots */}
              <div className="flex gap-1.5 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-muted-foreground">FitStyle AI</span>
                  <h3 className="text-lg font-medium">코디 추천 결과</h3>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              {/* Main Image */}
              <div className="relative aspect-[4/5] bg-accent rounded-2xl overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop"
                  alt="AI 추천 코디 결과"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">캐주얼 스타일</p>
                      <p className="font-medium">오버핏 셔츠 + 와이드 팬츠</p>
                    </div>
                    <Button size="sm" className="rounded-full gap-1">
                      상세보기
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent rounded-full text-xs">#평균체형</span>
                <span className="px-3 py-1 bg-accent rounded-full text-xs">#캐주얼</span>
                <span className="px-3 py-1 bg-accent rounded-full text-xs">#데일리룩</span>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -right-4 top-1/3 bg-card rounded-2xl p-4 shadow-lg border border-border/50 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">체형 분석 완료</p>
                  <p className="font-medium">175cm · 70kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
