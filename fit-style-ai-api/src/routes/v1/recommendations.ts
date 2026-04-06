import { Hono } from "hono"
import { z } from "zod"
import type { Gender, Season } from "@prisma/client"
import { recommendOutfits } from "../../services/recommendation.service.js"

const bodySchema = z.object({
  height_cm: z.number().int().min(130).max(220),
  weight_kg: z.number().min(30).max(200),
  body_type_code: z.string().min(1).max(32),
  gender: z.enum(["M", "F"]),
  season: z.enum(["SPRING", "SUMMER", "FALL", "WINTER"]).optional(),
  limit: z.number().int().min(1).max(10).optional().default(3),
  user_ref: z.string().max(128).optional(),
})

export const recommendationsRoute = new Hono()

recommendationsRoute.post("/", async (c) => {
  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    return c.json({ error: { code: "INVALID_JSON", message: "JSON 본문이 필요합니다." } }, 400)
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "입력값을 확인해 주세요.",
          details: parsed.error.flatten(),
        },
      },
      400,
    )
  }

  const d = parsed.data
  try {
    const result = await recommendOutfits({
      heightCm: d.height_cm,
      weightKg: d.weight_kg,
      bodyTypeCode: d.body_type_code,
      gender: d.gender as Gender,
      season: d.season as Season | undefined,
      limit: d.limit,
      userRef: d.user_ref,
    })

    if (result.outfits.length === 0) {
      return c.json(
        {
          bmi: result.bmi,
          outfits: [],
          message: "조건에 맞는 코디가 아직 없습니다. 입력을 바꿔 보세요.",
        },
        200,
      )
    }

    return c.json({
      bmi: result.bmi,
      outfits: result.outfits,
    })
  } catch (e) {
    if (e instanceof Error && (e as Error & { code?: string }).code === "UNKNOWN_BODY_TYPE") {
      return c.json({ error: { code: "UNKNOWN_BODY_TYPE", message: "지원하지 않는 체형 코드입니다." } }, 400)
    }
    console.error(e)
    return c.json({ error: { code: "INTERNAL_ERROR", message: "서버 오류입니다." } }, 500)
  }
})
