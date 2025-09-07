import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  chatBarChatSchema,
  renameChatBarChatSchema,
  userChatBarChatsSchema,
} from "./chatbar.dto";
import { supabase } from "../../server";

export const chatbarRoute = new Hono()
  .basePath("chatbarchat")
  .post("/create", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat = await c.req.json();
    const res = await supabase.from("chatbarchats").insert(chatbarchat);
    return c.json(res, 200);
  })
  .post("/rename", zValidator("json", renameChatBarChatSchema), async (c) => {
    const renameChatBarChat = await c.req.json();
    const res = await supabase
      .from("chatbarchats")
      .update(renameChatBarChat)
      .eq("id", renameChatBarChat.id);
    return c.json(res, 200);
  })
  .get("/", zValidator("query", userChatBarChatsSchema), async (c) => {
    const email = c.req.query("email");
    const res = await supabase.from("chatbarchats").select().eq("email", email);
    return c.json(res, 200);
  });
