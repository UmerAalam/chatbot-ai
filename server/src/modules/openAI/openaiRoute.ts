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
      openrouterModel,
      openrouterBaseUrl,
      ollamaModel,
    } = c.req.valid("json");

    try {
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
          const detail = await response.text().catch(() => "");
          return new Response(detail || "Failed to reach Ollama endpoint.", {
            status: response.status || 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        const data = (await response.json()) as { response?: string };
        return c.text(data.response || "");
      }

      if (!apiKey) {
        return c.text(
          "API key is required when provider is OpenAI/OpenRouter.",
          400,
        );
      }

      const isOpenRouter = modelProvider === "openrouter";
      const openai = new OpenAI({
        apiKey,
        ...(isOpenRouter
          ? {
              baseURL:
                (openrouterBaseUrl || "https://openrouter.ai/api/v1").replace(
                  /\/+$/,
                  "",
                ),
              defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "ChatBot AI",
              },
            }
          : {}),
      });
      const completion = await openai.responses.create({
        model: isOpenRouter
          ? openrouterModel || "openai/gpt-4o-mini"
          : openaiModel || "gpt-4.1-mini",
        input: prompt,
      });

      return c.text(completion.output_text || "");
    } catch (error) {
      const err = error as { message?: string; status?: number };
      return new Response(
        JSON.stringify({
          error: err?.message || "Request failed",
        }),
        {
          status: err?.status && err.status >= 400 ? err.status : 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }
  });
