import ChatPanel from "src/components/ChatPanel";
import SearchBar from "src/components/SearchBar";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

function HomePage() {
  const navigate = useNavigate();
  const handleSearchBtn = () => {
    navigate({ to: "/chatpage" });
  };
  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
      <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
        <ChatPanel />
        <SearchBar searchBtn={handleSearchBtn} />
      </div>
      <Button
        className={`absolute top-5 left-5 bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl`}
      >
        <FaArrowRight className="text-white/80" />
      </Button>
      {/* <ChatsBar /> */}
    </div>
  );
}

export default HomePage;
