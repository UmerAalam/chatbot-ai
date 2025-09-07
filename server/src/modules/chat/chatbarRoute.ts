import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { chatBarChatSchema, userChatBarChatsSchema } from "./chatbar.dto";
import { supabase } from "../../server";

export const chatbarRoute = new Hono()
  .basePath("chatbarchat")
  .post("/", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat = await c.req.json();
    const res = await supabase.from("chatbarchats").insert(chatbarchat);
    return c.json(res, 200);
  })
  .get("/", zValidator("query", userChatBarChatsSchema), async (c) => {
    const email = c.req.query("email");
    const res = await supabase.from("chatbarchats").select().eq("email", email);
    return c.json(res, 200);
  });
