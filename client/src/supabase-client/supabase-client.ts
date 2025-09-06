import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return data.user;
};

const setUser = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error during sign-in:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Unexpected error during login:", err);
    return null;
  }
};

const isLoggedIn = async () => {
  const user = await getUser();
  return user !== null;
};

export { getUser, setUser, isLoggedIn };
