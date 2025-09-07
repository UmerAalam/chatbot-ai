import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { chatBarChatSchema } from "./chatbar.dto";
import { supabase } from "../../server";

export const chatbarRoute = new Hono()
  .basePath("chatbarchat")
  .post("/", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat = await c.req.json();
    const res = await supabase.from("chatbarchats").insert(chatbarchat);
    return c.json(res, 200);
  })
  .get("/", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat = await c.req.json();
    const res = await supabase.from("chatbarchats").insert(chatbarchat);
    return c.json(res, 200);
  });
