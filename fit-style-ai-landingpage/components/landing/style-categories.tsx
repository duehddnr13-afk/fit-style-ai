"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = ["인기 스타일", "캐주얼", "미니멀", "스트릿"]

const styles = [
  {
    id: 1,
    name: "릴렉스 핏 셔츠",
    category: "캐주얼",
    description: "오버핏 린넨 셔츠",
    price: "₩49,000",
    size: "Free",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop"
  },
  {
    id: 2,
    name: "와이드 슬랙스",
    category: "미니멀",
    description: "편안한 핏의 슬랙스",
    price: "₩59,000",
    size: "M-XL",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop"
  },
  {
    id: 3,
    name: "오버사이즈 티셔츠",
    category: "스트릿",
    description: "여유로운 스트릿 무드",
    price: "₩35,000",
    size: "Free",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
  }
]

export function StyleCategories() {
  const [activeCategory, setActiveCategory] = useState("인기 스타일")

  return (
    <section id="styles" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-sm text-muted-foreground tracking-wide">
              / 추천 스타일
            </span>
            <h2 className="text-3xl md:text-4xl font-medium mt-4 text-balance">
              SHOP OUR BEST-SELLERS
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              체형 분석을 통해 검증된 인기 스타일을 만나보세요
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-colors border",
                activeCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Style Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {styles.map((style) => (
            <div
              key={style.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Bookmark Button */}
                <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <Button size="sm" className="rounded-full gap-2">
                    구매하기
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <span className="bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                    {style.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{style.name}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                    {style.size}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
