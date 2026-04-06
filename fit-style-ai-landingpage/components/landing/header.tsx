"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">FitStyle AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              체험
            </Link>
            <Link href="#service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              서비스
            </Link>
            <Link href="#styles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              추천 스타일
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              사용 방법
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button className="rounded-full px-6" asChild>
              <Link href="/demo">무료 코디 추천</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card">
                <nav className="flex flex-col gap-6 mt-8">
                  <Link
                    href="/demo"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    체험
                  </Link>
                  <Link 
                    href="#service" 
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    서비스
                  </Link>
                  <Link 
                    href="#styles" 
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    추천 스타일
                  </Link>
                  <Link 
                    href="#how-it-works" 
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    사용 방법
                  </Link>
                  <Link 
                    href="#faq" 
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Button className="rounded-full mt-4" asChild>
                    <Link href="/demo" onClick={() => setIsOpen(false)}>
                      무료 코디 추천
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
