import { authClient } from "../lib/auth-client";
import { useAuth } from "src/lib/FetchUser";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const SignUpPage = () => {
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/chatpage" });
    }
  }, [loading, user, navigate]);

  const handleSignIn = async () => {
    if (!name.trim() || !email.trim()) return;
    await authClient.signInLocal({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      image: null,
    });
    navigate({ to: "/chatpage" });
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col justify-center items-center">
      <div
        className="w-full max-w-sm p-6 rounded-2xl bg-gray-900 border border-gray-700 flex flex-col gap-3"
      >
        <h1 className="text-white text-2xl font-bold">Sign In</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="h-11 rounded-lg px-3 bg-gray-800 text-white outline-none border border-gray-700 focus:border-green-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="h-11 rounded-lg px-3 bg-gray-800 text-white outline-none border border-gray-700 focus:border-green-500"
        />
        <button
          onClick={handleSignIn}
          className="h-11 mt-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
