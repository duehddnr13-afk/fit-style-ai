export function calcBmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100
  if (m <= 0) return 0
  const v = weightKg / (m * m)
  return Math.round(v * 10) / 10
}
