import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { promptSchema } from "./openai.dto";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, streamText } from "ai";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com/v1/",
});

const model = anthropic("claude-3-haiku-20240307");

export const openaiRoute = new Hono()
  .basePath("result")
  .post("/", zValidator("json", promptSchema), async (c) => {
    const { prompt } = c.req.valid("json");
    const result = await generateText({ model, prompt });
    return c.json(result.content, 200);
  });
