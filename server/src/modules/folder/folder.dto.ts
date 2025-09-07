import z from "zod";

export const folderSchema = z.object({
  email: z.string().max(100).nonempty(),
  folder_name: z.string().max(100).nonempty(),
});
export const folderEmailSchema = z.object({
  email: z.string().max(100).nonempty(),
});
export const deleteFolderSchema = z.object({
  id: z.number().nonnegative(),
});
export const renameFolderSchema = z.object({
  id: z.number().nonnegative(),
  folder_name: z.string().max(100).nonempty(),
});

export interface Folder extends z.infer<typeof folderSchema> {}
export interface RenameFolder extends z.infer<typeof renameFolderSchema> {}
