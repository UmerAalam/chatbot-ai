import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { useAppSelector } from "src/app/hooks/hook";
import { Chat } from "src/app/slices/chatSlice";
import AnswerPrompt from "src/components/AnswerPrompt";
import PromptSection from "src/components/PromptSection";
import SearchBar from "src/components/SearchBar";

function ChatPage() {
  const chats: Chat[] = useAppSelector((state) => state.chats);
  console.log("chats in chatpage:", chats);
  const renderChatSections = chats.map((chat, index) => {
    return (
      <div key={index} className="flex flex-col gap-2 w-auto h-auto">
        <div className="flex justify-end">
          <PromptSection prompt={chat.prompt} />
        </div>
        <div className="flex justify-start">
          <AnswerPrompt answer={chat.answer} />
        </div>
      </div>
    );
  });
  return (
    <div className="w-full h-auto min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
      <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
        <div className="w-full px-50 flex flex-col gap-5 mt-20 justify-end">
          {renderChatSections}
        </div>
        <div className="flex justify-center items-end w-full h-full">
          <div className="flex justify-center items-center w-full mb-20">
            <SearchBar />
          </div>
        </div>
      </div>
      <Button
        className={`absolute top-5 left-5 bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl`}
      >
        <FaArrowRight className="text-white/80" />
      </Button>
    </div>
  );
}
export default ChatPage;
