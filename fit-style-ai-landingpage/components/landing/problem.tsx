import { Frown, ShoppingCart, HelpCircle } from "lucide-react"

const problems = [
  {
    icon: Frown,
    title: "모델 체형의 한계",
    description: "모델 기준의 코디는 일반 체형에 맞지 않아요"
  },
  {
    icon: ShoppingCart,
    title: "온라인 쇼핑 실패",
    description: "핏 실패로 반품하는 경험이 반복돼요"
  },
  {
    icon: HelpCircle,
    title: "코디 방법 부족",
    description: "어떤 옷이 나에게 어울리는지 모르겠어요"
  }
]

export function Problem() {
  return (
    <section id="service" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm text-muted-foreground tracking-wide">
            문제 공감
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-4 text-balance">
            왜 모델 코디는 나에게 안 어울릴까?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            많은 분들이 비슷한 고민을 하고 있어요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-6">
                <problem.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
