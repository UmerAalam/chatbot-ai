import z from "zod";

export const chatSchema = z.object({
  text: z.string().nonempty(),
  chatbar_id: z.coerce.string().nonempty(),
  email: z.string().nonempty(),
  role: z.string().nonempty().default("user"),
});
export const chatsByChatBarChatIDSchema = z.object({
  chatbar_id: z.coerce.string().nonempty(),
});
export const deleteChatSchema = z.object({
  chatbar_id: z.coerce.string().nonempty(),
});
export const renameChatSchema = z.object({
  id: z.number().nonnegative(),
  text: z.string().nonempty(),
});

export interface Chat extends z.infer<typeof chatSchema> {}
export interface RenameChat extends z.infer<typeof renameChatSchema> {}
