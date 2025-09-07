import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../../server";
import "dotenv/config";
import {
  chatBarChatSchema,
  deleteUserChatSchema,
  renameChatBarChatSchema,
  userChatBarChatsSchema,
} from "./chatbar.dto";

export const chatbarRoute = new Hono()
  .basePath("chatbarchat")
  .post("/", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat = await c.req.json();
    const res = await supabase.from("chatbarchats").insert(chatbarchat);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteUserChatSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await supabase
      .from("chatbarchats")
      .delete()
      .eq("id", Number(id));
    return c.json(res, 200);
  })
  .patch("/", zValidator("json", renameChatBarChatSchema), async (c) => {
    const { id, chat_name } = c.req.valid("json");
    const res = await supabase
      .from("chatbarchats")
      .update({ chat_name })
      .eq("id", Number(id))
      .select();
    return c.json(res, 200);
  })
  .get("/", zValidator("query", userChatBarChatsSchema), async (c) => {
    const email = c.req.query("email");
    const res = await supabase.from("chatbarchats").select().eq("email", email);
    return c.json(res, 200);
  });
