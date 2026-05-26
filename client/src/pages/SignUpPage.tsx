import { authClient } from "../lib/auth-client";
import { useAuthGuard } from "src/lib/FetchUser";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

const SignUpPage = () => {
  const { user, loading } = useAuthGuard({ requireAuth: false });
  const location = useLocation();
  const mode: "signin" | "signup" =
    location.pathname === "/signup" ? "signup" : "signin";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/chatpage" });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    const payload = {
      name: name.trim() || undefined,
      email: email.trim().toLowerCase(),
      password: password.trim(),
      image: null,
    };
    const res =
      mode === "signup"
        ? await authClient.signUpLocal(payload)
        : await authClient.signInLocal(payload);
    if (!res.data) {
      setInfo("");
      setError(res.error?.message || "Unable to continue");
      return;
    }
    setError("");
    if (mode === "signin" && res.data.created) {
      setInfo("User not found. Created a new account and logged you in.");
    } else if (mode === "signup") {
      setInfo("Account created. You are now logged in.");
    } else {
      setInfo("");
    }
    navigate({ to: "/chatpage" });
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col justify-center items-center">
      <div
        className="w-full max-w-sm p-6 rounded-2xl bg-gray-900 border border-gray-700 flex flex-col gap-3"
      >
        <h1 className="text-white text-2xl font-bold">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="h-11 rounded-lg px-3 bg-gray-800 text-white outline-none border border-gray-700 focus:border-green-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="h-11 rounded-lg px-3 bg-gray-800 text-white outline-none border border-gray-700 focus:border-green-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="h-11 rounded-lg px-3 bg-gray-800 text-white outline-none border border-gray-700 focus:border-green-500"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {info ? <p className="text-sm text-green-400">{info}</p> : null}
        <button
          onClick={handleSubmit}
          className="h-11 mt-1 rounded-2xl bg-green-400 text-green-900 hover:text-white border-2 border-transparent hover:border-white font-bold cursor-pointer"
        >
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>
        <button
          onClick={() => {
            setError("");
            setInfo("");
            navigate({ to: mode === "signin" ? "/signup" : "/signin" });
          }}
          className="h-11 rounded-2xl bg-white text-gray-800 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-white font-bold cursor-pointer"
        >
          {mode === "signin" ? "Need an account? Sign Up" : "Have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
