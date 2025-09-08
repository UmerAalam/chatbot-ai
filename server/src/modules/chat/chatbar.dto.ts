import z from "zod";

export const chatBarChatSchema = z.object({
  folderId: z.string().min(1).max(1000).default("DEFAULT"),
  chat_name: z.string().min(1).max(1000),
  email: z.string().max(100).nonempty(),
});
export const deleteUserChatSchema = z.object({
  id: z.number().nonnegative(),
});
export const userChatBarChatsSchema = z.object({
  email: z.string().max(100).nonempty(),
});

export const userChatsByFolderIDSchema = z.object({
  folder_id: z.number().nonnegative(),
});

export const renameChatBarChatSchema = z.object({
  id: z.number().nonnegative(),
  chat_name: z.string().max(100).nonempty(),
});

export interface ChatBarChat extends z.infer<typeof chatBarChatSchema> {}
export interface RenameChatBarChat
  extends z.infer<typeof renameChatBarChatSchema> {}
