import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks/hook";
import { addAnswerToChat, Chat } from "src/app/slices/chatSlice";
import AnswerPrompt from "src/components/AnswerPrompt";
import ChatPanel from "src/components/ChatPanel";
import PromptSection from "src/components/PromptSection";
import SearchBar from "src/components/SearchBar";
import axios from "axios";
import ChatsBar from "src/components/ChatsBar";

interface Data {
  data: {
    text: string;
  };
}

function ChatPage() {
  const chats: Chat[] = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [showBar, setShowBar] = useState(false);

  async function streamAnswer(prompt: string, onChunk: (s: string) => void) {
    const res = await fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.body) throw new Error("No body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      dispatch(addAnswerToChat(text));
      onChunk(decoder.decode(value, { stream: true }));
    }
  }
  const handleSearchBtn = async (prompt: string) => {
    setText("");
    const answer: Data = await axios.post("/api/result", { prompt });
    setText(answer.data.text);
    // streamAnswer(prompt, (chunk) => setText((prev) => prev + chunk));
  };
  const renderChatSections = chats.map((chat, index) => {
    return (
      <div key={index} className="flex flex-col gap-2 w-auto h-auto">
        <div className="flex justify-end">
          <PromptSection prompt={chat.prompt} />
        </div>
        <div className="flex justify-start">
          <AnswerPrompt answer={text} />
        </div>
      </div>
    );
  });
  return (
    <div className="w-full h-full min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
      <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
        <div className="w-full px-50 flex flex-col gap-5 mt-20 justify-end">
          {renderChatSections}
        </div>
        <div className="flex flex-col gap-5 justify-center items-center w-full h-full">
          <div
            className={`flex justify-center items-center w-full mt-20 ${chats.length > 0 && "mb-20"}`}
          >
            <SearchBar searchBtn={(prompt) => handleSearchBtn(prompt)} />
          </div>
          {chats.length === 0 && <ChatPanel />}
        </div>
      </div>
      {!showBar && (
        <Button
          id="arrow-Btn"
          onClick={() => setShowBar(!showBar)}
          className={`absolute top-5 left-5 bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl`}
        >
          <FaArrowRight className="text-white/80" />
        </Button>
      )}
      {showBar && <ChatsBar handleBtn={() => setShowBar(!showBar)} />}
    </div>
  );
}
export default ChatPage;
