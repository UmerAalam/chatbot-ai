import { User } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getUser, supabase } from "src/supabase-client/supabase-client";

const Avatar = () => {
  const [user, setUser] = useState<User>();
  const [avatar, setAvatar] = useState("");
  const [showCustomAvatar, setShowCustomAvatar] = useState(false);
  const [showDropdown, setShowDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const LoadUserDetails = async () => {
      const userdetails = await getUser();
      !userdetails && navigate({ to: "/" });
      userdetails && setUser(userdetails);
      const avatar_url = await userdetails?.user_metadata.avatar_url;
      setAvatar(avatar_url);
    };
    LoadUserDetails();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };
  return (
    <div
      onClick={() => setShowDropDown(!showDropdown)}
      className="absolute cursor-pointer top-5 right-5 bg-white z-10 rounded-full border-2 border-green-400 w-10 h-10"
    >
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-10 bg-gray-800/80 backdrop-blur-2xl text-white/90 rounded-lg shadow-lg border border-gray-700/50 w-40 z-10"
        >
          <ul className="flex flex-col text-sm">
            <li
              onClick={() => handleSignOut()}
              className="flex justify-start items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-lg text-red-400 hover:text-red-300"
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
      {showCustomAvatar ? (
        <div className="flex justify-center select-none items-center font-bold text-white text-xl w-full h-full bg-green-700 rounded-full">
          {user && user?.user_metadata.full_name.slice(0, 1)}
        </div>
      ) : (
        <img
          src={avatar === "" ? undefined : avatar}
          alt="Avatar"
          onError={() => setShowCustomAvatar(true)}
          className="rounded-full"
        />
      )}
    </div>
  );
};
export default Avatar;
