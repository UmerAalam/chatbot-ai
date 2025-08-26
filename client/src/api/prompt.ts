import axios from "axios";

async function sendPrompt(prompt: string) {
  try {
    const response = await puter.ai.chat(prompt, {
      model: "gpt-5-nano", // or another model like "gpt-4.1", "gpt-5"
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
