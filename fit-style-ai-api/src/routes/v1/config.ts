import { Hono } from "hono"
import { prisma } from "../../lib/prisma.js"

export const configRoute = new Hono()

configRoute.get("/", async (c) => {
  const bodyTypes = await prisma.bodyType.findMany({
    orderBy: { sortOrder: "asc" },
    select: { code: true, labelKo: true, sortOrder: true },
  })

  return c.json({
    version: "0.1.0",
    body_types: bodyTypes.map((b) => ({
      code: b.code,
      label_ko: b.labelKo,
      sort_order: b.sortOrder,
    })),
    limits: {
      recommendation_max: 10,
      height_cm: { min: 130, max: 220 },
      weight_kg: { min: 30, max: 200 },
    },
  })
})
