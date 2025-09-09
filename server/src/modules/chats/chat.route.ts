import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../../server";
import {
  chatsByChatBarChatIDSchema,
  chatSchema,
  deleteChatSchema,
  renameChatSchema,
} from "./chat.dto";
import "dotenv/config";

export const chatRoute = new Hono()
  .basePath("chats")
  .post("/", zValidator("json", chatSchema), async (c) => {
    const chat = await c.req.json();
    const res = await supabase.from("chats").insert(chat);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteChatSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await supabase.from("chats").delete().eq("id", Number(id));
    return c.json(res, 200);
  })
  .patch("/", zValidator("json", renameChatSchema), async (c) => {
    const { id, text } = c.req.valid("json");
    const res = await supabase
      .from("chats")
      .update({ text })
      .eq("id", Number(id))
      .select();
    return c.json(res, 200);
  })
  .get("/", zValidator("query", chatsByChatBarChatIDSchema), async (c) => {
    const chatbar_id = c.req.valid("query").chatbar_id;
    const res = await supabase
      .from("chats")
      .select()
      .eq("chatbar_id", Number(chatbar_id));
    return c.json(res, 200);
  });
