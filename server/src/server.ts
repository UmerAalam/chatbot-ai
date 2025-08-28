import axios from "axios";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";
import { openaiRouter } from "./modules/openaiRoute";

const app = new Hono()
  .use(logger())
  .use(
    "/api",
    cors({
      origin: "http://localhost:3000",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["*"],
    }),
  )
  .route("/api", openaiRouter);
export type AppType = typeof app;
serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export default app;
