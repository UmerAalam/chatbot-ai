import ChatPanel from "src/components/ChatPanel";
import SearchBar from "src/components/SearchBar";
import { useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function HomePage() {
  const navigate = useNavigate();
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
    </div>
  );
}

export default HomePage;
