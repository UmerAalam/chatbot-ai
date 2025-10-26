import { useEffect, useState } from "react";
import { authClient } from "./auth-client";
type User =
  | {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    }
  | undefined;

export async function fetchSession() {
  const res = await authClient.getSession();
  const session = res.data;
  return session?.user;
}
export function useAuth() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
