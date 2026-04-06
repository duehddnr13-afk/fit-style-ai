import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { recommendationsRoute } from "./routes/v1/recommendations.js"
import { configRoute } from "./routes/v1/config.js"
import { adminItemsRoute } from "./routes/v1/admin/items.js"
import { adminOutfitsRoute } from "./routes/v1/admin/outfits.js"
const app = new Hono()

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Key"],
  }),
)

app.get("/health", (c) => c.json({ ok: true, service: "fit-style-ai-api" }))

app.route("/v1/config", configRoute)
app.route("/v1/recommendations", recommendationsRoute)

const adminApp = new Hono()

adminApp.get("/health", (c) =>
  c.json({
    ok: true,
    scope: "admin",
    admin_configured: Boolean(
      process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY.length >= 8,
    ),
  }),
)

adminApp.route("/items", adminItemsRoute)
adminApp.route("/outfits", adminOutfitsRoute)

app.route("/v1/admin", adminApp)

const port = Number(process.env.PORT) || 3001

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
