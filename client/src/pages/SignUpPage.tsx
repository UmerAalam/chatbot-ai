import { FcGoogle } from "react-icons/fc";
import { authClient } from "../lib/auth-client";
import { useAuth } from "src/lib/FetchUser";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
const SignUpPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/chatpage" });
    }
  }, [user, loading]);
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (err) {
      console.error("Google sign in error:", err);
    }
  };
  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col justify-center items-center">
      <button
        onClick={handleGoogleSignIn}
        className="outline-2 gap-3 outline-gray-700 hover:outline-white text-white cursor-pointer font-bold w-50 flex items-center justify-center h-12 rounded-2xl"
      >
        <FcGoogle size={24} />
        <div className="mr-1 select-none text-xl">Sign Up</div>
      </button>
    </div>
  );
};

export default SignUpPage;
