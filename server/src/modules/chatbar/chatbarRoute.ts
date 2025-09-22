import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import "dotenv/config";
import {
  type ChatBarChat,
  chatBarChatSchema,
  deleteUserChatSchema,
  renameChatBarChatSchema,
  userChatBarChatsSchema,
  userChatsByFolderIDSchema,
} from "./chatbar.dto";
import {
  AddChatBarChat,
  DeleteChatBarChat,
  UpdateChatBarChat,
  UserChatsByEmail,
  UserChatsByFolderID,
} from "./chatbar.service";

export const chatbarRoute = new Hono()
  .basePath("chatbarchat")
  .post("/", zValidator("json", chatBarChatSchema), async (c) => {
    const chatbarchat: ChatBarChat = await c.req.json();
    const res = await AddChatBarChat(chatbarchat);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteUserChatSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await DeleteChatBarChat(id);
    return c.json(res, 200);
  })
  .patch("/", zValidator("json", renameChatBarChatSchema), async (c) => {
    const { id, chat_name } = c.req.valid("json");
    const res = await UpdateChatBarChat({ id, chat_name });
    return c.json(res, 200);
  })
  .get("/", zValidator("query", userChatBarChatsSchema), async (c) => {
    const email = c.req.query("email");
    const res = await UserChatsByEmail(email!);
    return c.json(res, 200);
  })
  .get(
    "/folderID",
    zValidator("query", userChatsByFolderIDSchema),
    async (c) => {
      const folder_id = c.req.query("folder_id");
      const res: ChatBarChat[] = await UserChatsByFolderID(
        folder_id?.toString()!,
      );
      return c.json(res, 200);
    },
  );
