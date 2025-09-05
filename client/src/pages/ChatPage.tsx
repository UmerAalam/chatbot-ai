import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks/hook";
import { addAnswerToChat, Chat } from "src/app/slices/chatSlice";
import AnswerPrompt from "src/components/AnswerPrompt";
import ChatPanel from "src/components/ChatPanel";
import PromptSection from "src/components/PromptSection";
import SearchBar from "src/components/SearchBar";
import axios from "axios";
import ChatsBar from "src/components/ChatsBar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AddAlert from "src/components/AddAlert";

interface Data {
  data: {
    text: string;
  };
}

function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const chats: Chat[] = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  useGSAP(() => {
    gsap.set(panelRef.current, { xPercent: -200, autoAlpha: 0 });
    tlRef.current = gsap.timeline({ paused: true }).to(panelRef.current, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power1",
    });
  }, []);
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
  const handleChatPanel = () => {
    const tl = tlRef.current!;
    if (!isOpen) {
      tl.play(0);
      setIsOpen(true);
    } else {
      tl.reverse();
      setIsOpen(false);
    }
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
    <div className="w-full flex flex-row h-full min-h-screen bg-black relative">
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
          <ChatPanel />
        </div>
      </div>
      {!isOpen && (
        <Button
          onClick={handleChatPanel}
          id="arrow-Btn"
          className="absolute top-5 left-5 bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl"
        >
          <FaArrowRight className="text-white/80" />
        </Button>
      )}
      <aside
        ref={panelRef}
        id="chat-panel"
        className="fixed left-0 top-0 w-full pointer-events-auto"
        aria-hidden={!isOpen}
      >
        <ChatsBar handleBtn={handleChatPanel} />
      </aside>
    </div>
  );
}
export default ChatPage;
