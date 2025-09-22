import { eq } from "drizzle-orm";
import db from "../../db";
import { chatsTable } from "../../db/schema";
import { Chat } from "./chat.dto";

export const AddChat = async (chat: Chat) => {
  const res = await db.insert(chatsTable).values(chat).returning();
  return res;
};
export const DeleteChatsByChatbarID = async (chatbar_id: string) => {
  const res = await db
    .delete(chatsTable)
    .where(eq(chatsTable.chatbar_id, chatbar_id))
    .returning();
  return res;
};
export const UserChatsByChatbarID = async (chatbar_id: string) => {
  const res = await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.chatbar_id, chatbar_id));
  return res;
};
