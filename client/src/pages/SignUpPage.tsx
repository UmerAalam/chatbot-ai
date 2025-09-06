import { FcGoogle } from "react-icons/fc";
import { getUser, supabase } from "../supabase-client/supabase-client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
const SignUpPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        navigate({ to: "/chatpage" });
        return null;
      }
    };
    checkUser();
  });
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error signing in:", error.message);
      return;
    }
  };
  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col justify-center items-center">
      <div className="outline-2 gap-3 outline-gray-700 hover:outline-white text-white cursor-pointer font-bold w-50 flex items-center justify-center h-12 rounded-2xl">
        <FcGoogle size={24} />
        <button onClick={handleSignUp} className="mr-1 select-none text-xl">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
