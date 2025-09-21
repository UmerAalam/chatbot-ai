import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";
import { openaiRoute } from "./modules/openAI/openaiRoute";
import { createClient } from "@supabase/supabase-js";
import { folderRoute } from "./modules/folder/folder.route";
import { chatbarRoute } from "./modules/chatbar/chatbarRoute";
import { chatRoute } from "./modules/chats/chat.route";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

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
  .route("/api", openaiRoute)
  .route("/api", chatbarRoute)
  .route("/api", folderRoute)
  .route("/api", chatRoute);

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
