import { useEffect, useState } from "react";
import { supabase } from "src/supabase-client/supabase-client";
import { Session } from "@supabase/supabase-js";
import SignUpPage from "./SignUpPage";

function HomePage() {
  const [_, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  return <SignUpPage />;
}

export default HomePage;
