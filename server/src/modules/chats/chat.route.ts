import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../../server";
import {
  chatsByChatBarChatIDSchema,
  chatSchema,
  deleteChatSchema,
} from "./chat.dto";
import "dotenv/config";
import { AddChat, UserChatsByChatbarID } from "./chat.service";
import { DeleteChatBarChat } from "../chatbar/chatbar.service";

export const chatRoute = new Hono()
  .basePath("chats")
  .post("/", zValidator("json", chatSchema), async (c) => {
    const chat = await c.req.json();
    const res = await AddChat(chat);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteChatSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await DeleteChatBarChat(id);
    return c.json(res, 200);
  })
  .get("/", zValidator("query", chatsByChatBarChatIDSchema), async (c) => {
    const chatbar_id = c.req.valid("query").chatbar_id;
    const res = await UserChatsByChatbarID(chatbar_id);
    return c.json(res, 200);
  });
