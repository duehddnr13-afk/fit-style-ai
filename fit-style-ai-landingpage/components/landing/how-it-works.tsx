import { ArrowRight } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "체형 입력",
    description: "키, 체중, 체형 정보를 간단히 입력하세요"
  },
  {
    step: "02",
    title: "사진 업로드",
    description: "전신 사진을 업로드하면 AI가 체형을 분석해요"
  },
  {
    step: "03",
    title: "AI 코디 추천",
    description: "나에게 딱 맞는 스타일과 코디를 추천받으세요"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm text-muted-foreground tracking-wide">
            사용 방법
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-4 text-balance">
            3단계로 나만의 스타일 찾기
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            복잡한 과정 없이 간단하게 시작하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-background rounded-2xl p-8 h-full border border-border/50">
                <span className="text-5xl font-light text-muted-foreground/30 mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
