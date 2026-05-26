const THREAD_MAP_KEY = "chat_thread_ids";

const loadMap = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(THREAD_MAP_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const saveMap = (map: Record<string, string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THREAD_MAP_KEY, JSON.stringify(map));
};

export const generateThreadId = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const getThreadIdForChatbar = (chatbarNumericId: number) => {
  const map = loadMap();
  const key = String(chatbarNumericId);
  if (!map[key]) {
    map[key] = generateThreadId();
    saveMap(map);
  }
  return map[key];
};

export const setThreadIdForChatbar = (
  chatbarNumericId: number,
  threadId: string,
) => {
  const map = loadMap();
  map[String(chatbarNumericId)] = threadId;
  saveMap(map);
};

export const getChatbarIdForThreadId = (threadId: string) => {
  const map = loadMap();
  const entry = Object.entries(map).find(([, value]) => value === threadId);
  return entry ? entry[0] : threadId;
};
