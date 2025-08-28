import { Hono } from "hono";
// import OpenAI from "openai";
import { zValidator } from "@hono/zod-validator";
import { promptSchema } from "./openai.dto";

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.VITE_API_KEY,
// });
export const openaiRouter = new Hono()
  .basePath("result")
  .get("/", zValidator("query", promptSchema), async (c) => {
    const prompt = c.req.query("prompt");
    console.log("Received prompt:", prompt, prompt?.length);
    // const completion = await openai.chat.completions.create({
    //   model: "deepseek/deepseek-r1:free",
    //   messages: [
    //     {
    //       role: "user",
    //       content: "What is the meaning of life?",
    //     },
    //   ],
    // });
    // const message = completion.choices[0].message;
    // console.log("message from openai:", message);
    // return c.json(message, 200);
    return c.json(prompt, 200);
  });
