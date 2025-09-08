import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../../server";
import "dotenv/config";
import {
  chatBarChatSchema,
  deleteUserChatSchema,
  renameChatBarChatSchema,
  userChatBarChatsSchema,
  userChatsByFolderIDSchema,
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
    const res = await supabase
      .from("chatbarchats")
      .select()
      .eq("email", email)
      .eq("folder_id", "DEFAULT");
    return c.json(res, 200);
  })
  .get(
    "/folderID",
    zValidator("query", userChatsByFolderIDSchema),
    async (c) => {
      const folder_id = c.req.query("folder_id");
      const res = await supabase
        .from("chatbarchats")
        .select()
        .eq("folder_id", folder_id);
      return c.json(res, 200);
    },
  );
