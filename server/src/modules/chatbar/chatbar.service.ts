import { and, eq } from "drizzle-orm";
import db from "../../db";
import { chatbarchatsTable, chatsTable } from "../../db/schema";
import { ChatBarChat } from "./chatbar.dto";

export const AddChatBarChat = async (chatbarchat: ChatBarChat) => {
  const res = await db
    .insert(chatbarchatsTable)
    .values({
      chat_name: chatbarchat.chat_name,
      email: chatbarchat.email,
      folder_id: chatbarchat.folder_id,
    })
    .returning();
  return res;
};
export const DeleteChatBarChat = async (chatbar_id: string) => {
  const res = await db
    .delete(chatsTable)
    .where(eq(chatsTable.chatbar_id, chatbar_id))
    .returning();
  return res;
};
export const UpdateChatBarChat = async (props: {
  chat_name: string;
  id: number;
}) => {
  const res = await db
    .update(chatbarchatsTable)
    .set({ chat_name: props.chat_name })
    .where(eq(chatbarchatsTable.id, props.id))
    .returning();
  return res;
};
export const UserChatsByEmail = async (email: string) => {
  const res = await db
    .select()
    .from(chatbarchatsTable)
    .where(
      and(
        eq(chatbarchatsTable.email, email),
        eq(chatbarchatsTable.folder_id, "DEFAULT"),
      ),
    );
  return res;
};
export const UserChatsByFolderID = async (folder_id: string) => {
  const res = await db
    .select()
    .from(chatbarchatsTable)
    .where(eq(chatbarchatsTable.folder_id, folder_id));
  return res;
};
