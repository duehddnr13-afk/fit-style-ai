import { Star } from "lucide-react"

const testimonials = [
  {
    name: "김민수",
    avatar: "👨",
    rating: 5,
    comment: "체형에 맞는 코디를 처음 찾았어요. 온라인 쇼핑 실패가 확 줄었습니다!",
    bodyType: "평균 체형"
  },
  {
    name: "이준호",
    avatar: "🧑",
    rating: 5,
    comment: "패션 초보인데 AI 추천대로 입으니까 주변에서 옷 잘 입는다고 해요.",
    bodyType: "마른 체형"
  },
  {
    name: "박서준",
    avatar: "👤",
    rating: 5,
    comment: "하체가 발달한 체형인데 딱 맞는 핏을 추천받아서 만족합니다.",
    bodyType: "하체 발달"
  }
]

const stats = [
  { value: "20,000+", label: "코디 추천 완료" },
  { value: "4.9", label: "평균 만족도" },
  { value: "85%", label: "재구매율" }
]

export function Trust() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-medium">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <span className="text-sm text-muted-foreground tracking-wide">
            사용자 후기
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-4 text-balance">
            실제 사용자들의 이야기
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.bodyType}</p>
                </div>
              </div>
              
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
