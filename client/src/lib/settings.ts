export type ModelProvider = "openai" | "openrouter" | "ollama";

export type AppSettings = {
  apiKey: string;
  databaseUrl: string;
  ollamaUrl: string;
  modelProvider: ModelProvider;
  openaiModel: string;
  openrouterModel: string;
  openrouterBaseUrl: string;
  ollamaModel: string;
};

const SETTINGS_KEY = "chatbot_settings";

export const defaultSettings: AppSettings = {
  apiKey: "",
  databaseUrl: "",
  ollamaUrl: "http://localhost:11434",
  modelProvider: "ollama",
  openaiModel: "gpt-4.1-mini",
  openrouterModel: "openai/gpt-4o-mini",
  openrouterBaseUrl: "https://openrouter.ai/api/v1",
  ollamaModel: "llama3.2",
};

export const loadSettings = (): AppSettings => {
  if (typeof window === "undefined") return defaultSettings;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
