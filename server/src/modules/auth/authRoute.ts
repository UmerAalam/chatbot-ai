import { Hono } from "hono";
import { auth } from "../../lib/auth";

export const authRoute = new Hono();

authRoute.all("auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

authRoute.get("/auth/me", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) return c.json({ msg: "Not authenticated" }, 401);

  return c.json({ msg: "Authenticated!", user: session.user });
});
