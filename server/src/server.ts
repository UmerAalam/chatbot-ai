import axios from "axios";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";
const app = new Hono();

app.use(logger());
app.use(
  "/api",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["*"],
  }),
);

const route = app.get("/api/lorem", async (c) => {
  try {
    const response = await axios.get(
      "https://api.api-ninjas.com/v1/loremipsum?paragraphs=1",
      {
        headers: {
          "X-Api-Key": process.env.VITE_NINJA_API,
        },
      },
    );

    return c.json(response.data, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Something went wrong" }, 500);
  }
});

export type AppType = typeof route;

export default {
  port: 8000,
  fetch: app.fetch,
};
