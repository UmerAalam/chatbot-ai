import z from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

export interface Prompt extends z.infer<typeof promptSchema> {}
