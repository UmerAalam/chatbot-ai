import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  deleteFolderSchema,
  folderEmailSchema,
  folderSchema,
  renameFolderSchema,
} from "./folder.dto";
import { supabase } from "../../server";
import "dotenv/config";
import {
  AddFolder,
  DeleteFolderByID,
  RenameFolderByID,
  UserFoldersByEmail,
} from "./folder.service";

export const folderRoute = new Hono()
  .basePath("folder")
  .post("/", zValidator("json", folderSchema), async (c) => {
    const folder = await c.req.json();
    const res = await AddFolder(folder);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteFolderSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await DeleteFolderByID(id);
    return c.json(res, 200);
  })
  .patch("/", zValidator("json", renameFolderSchema), async (c) => {
    const renameFolder = c.req.valid("json");
    const res = await RenameFolderByID(renameFolder);
    return c.json(res, 200);
  })
  .get("/", zValidator("query", folderEmailSchema), async (c) => {
    const email = c.req.query("email");
    const res = await UserFoldersByEmail(email!);
    return c.json(res, 200);
  });
