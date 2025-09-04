import ChatPanel from "src/components/ChatPanel";
import SearchBar from "src/components/SearchBar";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import ChatsBar from "src/components/ChatsBar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [showBar, setShowBar] = useState(false);
  const handleSearchBtn = () => {
    navigate({ to: "/chatpage" });
  };
  useGSAP(() => {
    gsap.fromTo(
      "#arrow-Btn",
      {
        position: "absolute",
        top: 10,
        left: -5,
        borderRadius: "0%",
      },
      {
        duration: 0.5,
        ease: "elastic.in",
        position: "absolute",
        top: 10,
        left: 15,
        borderRadius: "100%",
      },
    );
    gsap.fromTo(
      "#chat-panel",
      { opacity: 0 },
      { duration: 0.5, ease: "power1", opacity: 1 },
    );
  });
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSearchBtn();
        }
      }}
      className="w-full h-screen bg-black relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
      <div
        id="chat-panel"
        className="flex flex-col gap-3 justify-center items-center w-full h-full"
      >
        <ChatPanel />
        <SearchBar />
      </div>
      {!showBar && (
        <Button
          id="arrow-Btn"
          onClick={() => setShowBar(!showBar)}
          className={`absolute bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl`}
        >
          <FaArrowRight className="text-white/80" />
        </Button>
      )}
      {showBar && <ChatsBar />}
    </div>
  );
}

export default HomePage;
