import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { setUser, supabase } from "../supabase-client/supabase-client";
import { useNavigate } from "@tanstack/react-router";
import { Session } from "@supabase/supabase-js";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
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

  const handleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col justify-center items-center">
      <div className="outline-2 gap-3 outline-gray-700 hover:outline-white text-white cursor-pointer font-bold w-50 flex items-center justify-center h-12 rounded-2xl">
        <FcGoogle size={24} />
        <button onClick={handleSignUp} className="mr-1 select-none text-xl">
          Sign Up
        </button>
      </div>
      <div className="text-white text-xl font-bold mt-5">
        {session ? "LoggedIn" : "Need To SignIn"}
      </div>
    </div>
  );
};

export default SignUpPage;
