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

export const folderRoute = new Hono()
  .basePath("folder")
  .post("/", zValidator("json", folderSchema), async (c) => {
    const folder = await c.req.json();
    const res = await supabase.from("folders").insert(folder);
    return c.json(res, 200);
  })
  .delete("/", zValidator("json", deleteFolderSchema), async (c) => {
    const { id } = await c.req.json();
    const res = await supabase.from("folders").delete().eq("id", Number(id));
    return c.json(res, 200);
  })
  .patch("/", zValidator("json", renameFolderSchema), async (c) => {
    const { id, folder_name } = c.req.valid("json");
    const res = await supabase
      .from("folders")
      .update({ folder_name })
      .eq("id", Number(id))
      .select();
    return c.json(res, 200);
  })
  .get("/", zValidator("query", folderEmailSchema), async (c) => {
    const email = c.req.query("email");
    const res = await supabase.from("folders").select().eq("email", email);
    return c.json(res, 200);
  });
