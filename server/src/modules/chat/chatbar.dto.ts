import z from "zod";

export const chatBarChatSchema = z.object({
  folderId: z.string().min(1).max(1000).optional().default("DEFAULT"),
  chat_name: z.string().min(1).max(1000),
  email: z.string().max(100).nonempty(),
});
export const userChatBarChatsSchema = z.object({
  email: z.string().max(100).nonempty(),
});

export interface ChatBarChat extends z.infer<typeof chatBarChatSchema> {}
