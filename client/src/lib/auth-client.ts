export type LocalUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

const USER_KEY = "chatbot_user";

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const authClient = {
  getSession: async () => {
    if (typeof window === "undefined") return { data: null };
    const user = safeParse<LocalUser>(window.localStorage.getItem(USER_KEY));
    return { data: user ? { user } : null };
  },
  signInLocal: async (user: Omit<LocalUser, "id">) => {
    if (typeof window === "undefined") return { data: null };
    const nextUser: LocalUser = {
      id: crypto.randomUUID(),
      ...user,
    };
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return { data: { user: nextUser } };
  },
  signOut: async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
    return { data: null };
  },
};
