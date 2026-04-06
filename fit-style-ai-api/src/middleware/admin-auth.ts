import type { MiddlewareHandler } from "hono"

/** Authorization: Bearer <key> 또는 X-Admin-Key */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const key = process.env.ADMIN_API_KEY
  if (!key || key.length < 8) {
    return c.json(
      {
        error: {
          code: "ADMIN_DISABLED",
          message: "ADMIN_API_KEY가 서버에 설정되지 않았거나 너무 짧습니다.",
        },
      },
      503,
    )
  }

  const auth = c.req.header("Authorization")
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null
  const headerKey = c.req.header("X-Admin-Key")?.trim()
  const token = bearer ?? headerKey
  if (!token || token !== key) {
    return c.json({ error: { code: "UNAUTHORIZED", message: "관리자 인증이 필요합니다." } }, 401)
  }

  await next()
}
