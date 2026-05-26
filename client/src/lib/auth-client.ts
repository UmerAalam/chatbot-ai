export type LocalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string | null;
};

const USER_KEY = "chatbot_user";
const USERS_KEY = "chatbot_users";

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
  signInLocal: async (input: {
    email: string;
    password: string;
    name?: string;
    image?: string | null;
  }) => {
    if (typeof window === "undefined") return { data: null };
    const users = safeParse<LocalUser[]>(window.localStorage.getItem(USERS_KEY)) ?? [];
    const email = input.email.trim().toLowerCase();
    const existing = users.find((u) => u.email === email);

    if (existing) {
      if (existing.password !== input.password) {
        return { data: null, error: { message: "Invalid password" } };
      }
      window.localStorage.setItem(USER_KEY, JSON.stringify(existing));
      return { data: { user: existing, created: false } };
    }

    const resolvedName =
      input.name?.trim() || email.split("@")[0] || "User";
    const nextUser: LocalUser = {
      id: crypto.randomUUID(),
      name: resolvedName,
      email,
      password: input.password,
      image: input.image ?? null,
    };
    users.push(nextUser);
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return { data: { user: nextUser, created: true } };
  },
  signUpLocal: async (input: {
    email: string;
    password: string;
    name?: string;
    image?: string | null;
  }) => {
    if (typeof window === "undefined") return { data: null };
    const users = safeParse<LocalUser[]>(window.localStorage.getItem(USERS_KEY)) ?? [];
    const email = input.email.trim().toLowerCase();
    const existing = users.find((u) => u.email === email);

    if (existing) {
      return { data: null, error: { message: "User already exists" } };
    }

    const resolvedName = input.name?.trim() || email.split("@")[0] || "User";
    const nextUser: LocalUser = {
      id: crypto.randomUUID(),
      name: resolvedName,
      email,
      password: input.password,
      image: input.image ?? null,
    };
    users.push(nextUser);
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return { data: { user: nextUser, created: true } };
  },
  signOut: async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
    return { data: null };
  },
};
