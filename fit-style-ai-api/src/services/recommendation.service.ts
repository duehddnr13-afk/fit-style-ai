import type { Gender, Season } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import { calcBmi } from "../lib/bmi.js"

export type SlotRole = "TOP" | "BOTTOM" | "OUTER" | "SHOES"

export type OutfitSlot = { role: SlotRole; image_url: string | null }

export type OutfitResponse = {
  id: string
  name: string
  summary: string | null
  slots: OutfitSlot[]
}

export async function recommendOutfits(input: {
  heightCm: number
  weightKg: number
  bodyTypeCode: string
  gender: Gender
  season?: Season
  limit: number
  userRef?: string | null
  logRequest?: boolean
}): Promise<{ bmi: number; outfits: OutfitResponse[] }> {
  const bmi = calcBmi(input.heightCm, input.weightKg)

  const bodyType = await prisma.bodyType.findUnique({
    where: { code: input.bodyTypeCode },
  })
  if (!bodyType) {
    const err = new Error("UNKNOWN_BODY_TYPE") as Error & { code: string }
    err.code = "UNKNOWN_BODY_TYPE"
    throw err
  }

  const seasonFilter =
    input.season != null
      ? {
          OR: [{ season: null }, { season: input.season }],
        }
      : {}

  const candidates = await prisma.outfitSet.findMany({
    where: {
      isActive: true,
      gender: input.gender,
      bodyTypes: { some: { id: bodyType.id } },
      ...seasonFilter,
    },
    include: {
      top: true,
      bottom: true,
      outer: true,
      shoes: true,
    },
    orderBy: [{ priority: "desc" }, { id: "asc" }],
    take: 80,
  })

  const filtered = candidates.filter((o) => {
    if (o.bmiMin != null && bmi < o.bmiMin) return false
    if (o.bmiMax != null && bmi > o.bmiMax) return false
    return true
  })

  const picked = filtered.slice(0, input.limit).map(mapOutfit)

  if (input.logRequest !== false) {
    await prisma.recommendationLog
      .create({
        data: {
          userRef: input.userRef ?? null,
          heightCm: input.heightCm,
          weightKg: input.weightKg,
          bodyTypeId: bodyType.id,
          bmi,
          outfitSetIds: picked.map((p) => p.id),
        },
      })
      .catch(() => {
        /* 로깅 실패는 추천 응답에 영향 없음 */
      })
  }

  return { bmi, outfits: picked }
}

function mapOutfit(o: {
  id: bigint
  nameKo: string
  summaryKo: string | null
  top: { imageUrl: string }
  bottom: { imageUrl: string }
  outer: { imageUrl: string } | null
  shoes: { imageUrl: string }
}): OutfitResponse {
  return {
    id: String(o.id),
    name: o.nameKo,
    summary: o.summaryKo,
    slots: [
      { role: "TOP", image_url: o.top.imageUrl },
      { role: "BOTTOM", image_url: o.bottom.imageUrl },
      { role: "OUTER", image_url: o.outer?.imageUrl ?? null },
      { role: "SHOES", image_url: o.shoes.imageUrl },
    ],
  }
}
