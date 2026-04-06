import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { RecommendationDemo } from "@/components/demo/recommendation-demo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "코디 추천 체험 | FitStyle AI",
  description: "키·몸무게·체형 입력으로 추천 코디(제품 컷) 미리보기",
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="rounded-full gap-1" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              홈
            </Link>
          </Button>
          <span className="text-sm font-medium">코디 추천 체험</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        <RecommendationDemo />
      </main>
    </div>
  )
}
