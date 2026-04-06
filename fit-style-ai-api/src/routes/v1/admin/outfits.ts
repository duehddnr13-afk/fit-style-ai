import { Hono } from "hono"
import { z } from "zod"
import type { Gender, Season } from "@prisma/client"
import { prisma } from "../../../lib/prisma.js"
import { requireAdmin } from "../../../middleware/admin-auth.js"

const idString = z.string().regex(/^\d+$/)

const createSchema = z.object({
  code: z.string().min(1).max(64),
  name_ko: z.string().min(1).max(200),
  gender: z.enum(["M", "F"]),
  season: z.enum(["SPRING", "SUMMER", "FALL", "WINTER"]).optional().nullable(),
  top_id: idString,
  bottom_id: idString,
  outer_id: idString.optional().nullable(),
  shoes_id: idString,
  bmi_min: z.number().optional().nullable(),
  bmi_max: z.number().optional().nullable(),
  priority: z.number().int().optional(),
  summary_ko: z.string().optional().nullable(),
  body_type_codes: z.array(z.string()).min(1),
})

const patchSchema = createSchema.partial()

function toBigInt(s: string): bigint {
  return BigInt(s)
}

export const adminOutfitsRoute = new Hono()
adminOutfitsRoute.use("*", requireAdmin)

adminOutfitsRoute.get("/", async (c) => {
  const includeInactive = c.req.query("include_inactive") === "true"
  const list = await prisma.outfitSet.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: [{ priority: "desc" }, { id: "asc" }],
    take: 200,
    include: {
      bodyTypes: { select: { code: true } },
      top: { select: { id: true, title: true } },
      bottom: { select: { id: true, title: true } },
      outer: { select: { id: true, title: true } },
      shoes: { select: { id: true, title: true } },
    },
  })

  return c.json({
    outfits: list.map((o) => ({
      id: String(o.id),
      code: o.code,
      name_ko: o.nameKo,
      gender: o.gender,
      season: o.season,
      top_id: String(o.topId),
      bottom_id: String(o.bottomId),
      outer_id: o.outerId != null ? String(o.outerId) : null,
      shoes_id: String(o.shoesId),
      bmi_min: o.bmiMin,
      bmi_max: o.bmiMax,
      priority: o.priority,
      summary_ko: o.summaryKo,
      is_active: o.isActive,
      body_type_codes: o.bodyTypes.map((b) => b.code),
    })),
  })
})

adminOutfitsRoute.post("/", async (c) => {
  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    return c.json({ error: { code: "INVALID_JSON" } }, 400)
  }
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return c.json({ error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } }, 400)
  }
  const d = parsed.data

  const created = await prisma.outfitSet.create({
    data: {
      code: d.code,
      nameKo: d.name_ko,
      gender: d.gender as Gender,
      season: (d.season ?? undefined) as Season | undefined,
      topId: toBigInt(d.top_id),
      bottomId: toBigInt(d.bottom_id),
      outerId: d.outer_id ? toBigInt(d.outer_id) : null,
      shoesId: toBigInt(d.shoes_id),
      bmiMin: d.bmi_min ?? undefined,
      bmiMax: d.bmi_max ?? undefined,
      priority: d.priority ?? 0,
      summaryKo: d.summary_ko ?? undefined,
      bodyTypes: { connect: d.body_type_codes.map((code) => ({ code })) },
    },
  })

  return c.json({ id: String(created.id) }, 201)
})

adminOutfitsRoute.patch("/:id", async (c) => {
  let id: bigint
  try {
    id = BigInt(c.req.param("id"))
  } catch {
    return c.json({ error: { code: "INVALID_ID" } }, 400)
  }

  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    return c.json({ error: { code: "INVALID_JSON" } }, 400)
  }
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return c.json({ error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } }, 400)
  }
  const d = parsed.data

  const exists = await prisma.outfitSet.findUnique({ where: { id } })
  if (!exists) return c.json({ error: { code: "NOT_FOUND" } }, 404)

  await prisma.outfitSet.update({
    where: { id },
    data: {
      ...(d.code != null && { code: d.code }),
      ...(d.name_ko != null && { nameKo: d.name_ko }),
      ...(d.gender != null && { gender: d.gender as Gender }),
      ...(d.season !== undefined && { season: d.season as Season | null }),
      ...(d.top_id != null && { topId: toBigInt(d.top_id) }),
      ...(d.bottom_id != null && { bottomId: toBigInt(d.bottom_id) }),
      ...(d.outer_id !== undefined && {
        outerId: d.outer_id ? toBigInt(d.outer_id) : null,
      }),
      ...(d.shoes_id != null && { shoesId: toBigInt(d.shoes_id) }),
      ...(d.bmi_min !== undefined && { bmiMin: d.bmi_min }),
      ...(d.bmi_max !== undefined && { bmiMax: d.bmi_max }),
      ...(d.priority != null && { priority: d.priority }),
      ...(d.summary_ko !== undefined && { summaryKo: d.summary_ko }),
      ...(d.body_type_codes != null && {
        bodyTypes: { set: d.body_type_codes.map((code) => ({ code })) },
      }),
    },
  })

  return c.json({ ok: true })
})

adminOutfitsRoute.delete("/:id", async (c) => {
  let id: bigint
  try {
    id = BigInt(c.req.param("id"))
  } catch {
    return c.json({ error: { code: "INVALID_ID" } }, 400)
  }

  const exists = await prisma.outfitSet.findUnique({ where: { id } })
  if (!exists) return c.json({ error: { code: "NOT_FOUND" } }, 404)

  await prisma.outfitSet.update({
    where: { id },
    data: { isActive: false },
  })

  return c.json({ ok: true })
})
