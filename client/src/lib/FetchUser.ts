import { useEffect, useState } from "react";
import { authClient } from "./auth-client";
import { useNavigate } from "@tanstack/react-router";
type User =
  | {
      id: string;
      email: string;
      name: string;
      image?: string | null;
    }
  | undefined;

export async function fetchSession() {
  const res = await authClient.getSession();
  const session = res.data;
  return session?.user;
}
export function useAuth() {
  return useAuthGuard();
}

export function useAuthGuard(options?: { requireAuth?: boolean; redirectTo?: string }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const requireAuth = options?.requireAuth ?? true;
  const redirectTo = options?.redirectTo ?? "/signin";
  useEffect(() => {
    fetchSession().then((user) => {
      if (!user) {
        setLoading(false);
        if (requireAuth) {
          return navigate({ to: redirectTo });
        }
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [navigate, requireAuth, redirectTo]);

  return { user, loading };
}
