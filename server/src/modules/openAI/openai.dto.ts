import z from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(1).max(1000),
  apiKey: z.string().optional(),
  databaseUrl: z.string().optional(),
  ollamaUrl: z.string().optional(),
  modelProvider: z.enum(["openai", "ollama"]).optional(),
  openaiModel: z.string().optional(),
  ollamaModel: z.string().optional(),
});

export interface Prompt extends z.infer<typeof promptSchema> {}
