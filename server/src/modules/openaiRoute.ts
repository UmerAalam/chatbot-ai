import { Hono } from "hono";
import OpenAI from "openai";
import { zValidator } from "@hono/zod-validator";
import { promptSchema } from "./openai.dto";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
    "X-Title": "chatbot-ai",
  },
});
console.log(process.env.OPENROUTER_API_KEY);
export const openaiRoute = new Hono()
  .basePath("result")
  .post("/", zValidator("json", promptSchema), async (c) => {
    const body = await c.req.json();
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: "What is the meaning of life?",
        },
      ],
    });
    const message = completion.choices[0].message;
    console.log("message from openai:", message);
    return c.json(message, 200);
  });
