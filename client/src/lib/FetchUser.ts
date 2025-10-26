import { useEffect, useState } from "react";
import { authClient } from "./auth-client";
import { useNavigate } from "@tanstack/react-router";
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
  console.log(session);
  return session?.user;
}
export function useAuth() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSession().then((user) => {
      if (!user) {
        console.log("User isn't available");
        return navigate({ to: "/" });
      }
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
