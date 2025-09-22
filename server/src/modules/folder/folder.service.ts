import { eq } from "drizzle-orm";
import db from "../../db";
import { foldersTable } from "../../db/schema";
import { Folder, RenameFolder } from "./folder.dto";

export const AddFolder = async (folder: Folder) => {
  const res = await db.insert(foldersTable).values(folder).returning();
  return res;
};
export const DeleteFolderByID = async (id: number) => {
  const res = await db
    .delete(foldersTable)
    .where(eq(foldersTable.id, id))
    .returning();
  return res;
};
export const RenameFolderByID = async (renameFolder: RenameFolder) => {
  const res = await db
    .update(foldersTable)
    .set({ folder_name: renameFolder.folder_name })
    .returning();
  return res;
};
export const UserFoldersByEmail = async (email: string) => {
  const res = await db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.email, email));
  return res;
};
