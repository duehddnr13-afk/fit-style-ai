import { Hono } from "hono"
import { z } from "zod"
import { Prisma, type Gender, type ItemCategory } from "@prisma/client"
import { prisma } from "../../../lib/prisma.js"
import { requireAdmin } from "../../../middleware/admin-auth.js"

const createSchema = z.object({
  category: z.enum(["TOP", "BOTTOM", "OUTER", "SHOES"]),
  gender: z.enum(["M", "F", "UNISEX"]),
  title: z.string().min(1).max(200),
  image_url: z.string().url(),
  silhouette_tags: z.record(z.string(), z.unknown()).optional(),
  bmi_min: z.number().optional().nullable(),
  bmi_max: z.number().optional().nullable(),
  body_type_codes: z.array(z.string()).optional(),
})

const patchSchema = createSchema.partial()

function parseId(param: string | undefined): bigint | null {
  if (!param) return null
  try {
    return BigInt(param)
  } catch {
    return null
  }
}

export const adminItemsRoute = new Hono()
adminItemsRoute.use("*", requireAdmin)

adminItemsRoute.get("/", async (c) => {
  const includeInactive = c.req.query("include_inactive") === "true"
  const items = await prisma.item.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { id: "desc" },
    include: { bodyTypes: { select: { code: true, labelKo: true } } },
    take: 200,
  })

  return c.json({
    items: items.map((it) => ({
      id: String(it.id),
      category: it.category,
      gender: it.gender,
      title: it.title,
      image_url: it.imageUrl,
      silhouette_tags: it.silhouetteTags,
      bmi_min: it.bmiMin,
      bmi_max: it.bmiMax,
      is_active: it.isActive,
      body_types: it.bodyTypes.map((b) => b.code),
    })),
  })
})

adminItemsRoute.post("/", async (c) => {
  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    return c.json({ error: { code: "INVALID_JSON", message: "JSON 본문이 필요합니다." } }, 400)
  }
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return c.json({ error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } }, 400)
  }
  const d = parsed.data

  const created = await prisma.item.create({
    data: {
      category: d.category as ItemCategory,
      gender: d.gender as Gender,
      title: d.title,
      imageUrl: d.image_url,
      silhouetteTags:
        d.silhouette_tags !== undefined
          ? (d.silhouette_tags as Prisma.InputJsonValue)
          : undefined,
      bmiMin: d.bmi_min ?? undefined,
      bmiMax: d.bmi_max ?? undefined,
      bodyTypes: d.body_type_codes?.length
        ? { connect: d.body_type_codes.map((code) => ({ code })) }
        : undefined,
    },
  })

  return c.json({ id: String(created.id) }, 201)
})

adminItemsRoute.patch("/:id", async (c) => {
  const id = parseId(c.req.param("id"))
  if (id == null) return c.json({ error: { code: "INVALID_ID" } }, 400)

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

  const exists = await prisma.item.findUnique({ where: { id } })
  if (!exists) return c.json({ error: { code: "NOT_FOUND" } }, 404)

  await prisma.item.update({
    where: { id },
    data: {
      ...(d.category != null && { category: d.category as ItemCategory }),
      ...(d.gender != null && { gender: d.gender as Gender }),
      ...(d.title != null && { title: d.title }),
      ...(d.image_url != null && { imageUrl: d.image_url }),
      ...(d.silhouette_tags !== undefined && {
        silhouetteTags: d.silhouette_tags as Prisma.InputJsonValue,
      }),
      ...(d.bmi_min !== undefined && { bmiMin: d.bmi_min }),
      ...(d.bmi_max !== undefined && { bmiMax: d.bmi_max }),
      ...(d.body_type_codes != null && {
        bodyTypes: { set: d.body_type_codes.map((code) => ({ code })) },
      }),
    },
  })

  return c.json({ ok: true })
})

adminItemsRoute.delete("/:id", async (c) => {
  const id = parseId(c.req.param("id"))
  if (id == null) return c.json({ error: { code: "INVALID_ID" } }, 400)

  const exists = await prisma.item.findUnique({ where: { id } })
  if (!exists) return c.json({ error: { code: "NOT_FOUND" } }, 404)

  await prisma.item.update({
    where: { id },
    data: { isActive: false },
  })

  return c.json({ ok: true })
})
