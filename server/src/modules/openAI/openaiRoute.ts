import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { promptSchema } from "./openai.dto";
import OpenAI from "openai";

export const openaiRoute = new Hono()
  .basePath("result")
  .post("/", zValidator("json", promptSchema), async (c) => {
    const {
      prompt,
      apiKey,
      ollamaUrl,
      modelProvider,
      openaiModel,
      ollamaModel,
    } = c.req.valid("json");

    if (modelProvider === "ollama") {
      const baseUrl = (ollamaUrl || "http://localhost:11434").replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel || "llama3.2",
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        return c.text("Failed to reach Ollama endpoint.", 500);
      }

      const data = (await response.json()) as { response?: string };
      return c.text(data.response || "");
    }

    if (!apiKey) {
      return c.text("OpenAI API key is required when provider is OpenAI.", 400);
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.responses.create({
      model: openaiModel || "gpt-4.1-mini",
      input: prompt,
    });

    return c.text(completion.output_text || "");
  });
