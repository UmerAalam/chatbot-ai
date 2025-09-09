import z from "zod";

export const chatSchema = z.object({
  text: z.string().max(100).nonempty(),
  chatbar_id: z.number().nonnegative(),
  email: z.string().nonempty(),
});
export const chatsByChatBarChatIDSchema = z.object({
  chatbar_id: z.string().nonempty(),
});
export const deleteChatSchema = z.object({
  chatbar_id: z.number().nonnegative(),
});
export const renameChatSchema = z.object({
  id: z.number().nonnegative(),
  text: z.string().max(100).nonempty(),
});

export interface Chat extends z.infer<typeof chatSchema> {}
export interface RenameChat extends z.infer<typeof renameChatSchema> {}
