import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { StyleCategories } from "@/components/landing/style-categories"
import { Trust } from "@/components/landing/trust"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <StyleCategories />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
