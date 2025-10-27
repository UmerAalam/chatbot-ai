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
  try {
    const res = await authClient.getSession();
    return res.data?.user;
  } catch (err) {
    return undefined;
  }
}
export function useAuth() {
  const [user, setUser] = useState<User>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await fetchSession();
      if (!currentUser) {
        setLoading(false);
        navigate({ to: "/" });
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };
    checkSession();
  }, [navigate]);

  return { user, loading };
}
