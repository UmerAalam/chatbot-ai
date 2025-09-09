import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import AnswerPrompt from "src/components/AnswerPrompt";
import ChatPanel from "src/components/ChatPanel";
import PromptSection from "src/components/PromptSection";
import SearchBar from "src/components/SearchBar";
import ChatsBar from "src/components/ChatsBar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Session } from "@supabase/supabase-js";
import { supabase } from "src/supabase-client/supabase-client";
import Avatar from "src/components/Avatar";
import { useNavigate } from "@tanstack/react-router";
import { useChatCreate, useChatsByChatBarID } from "src/query/chats";

function ChatPage(props: { chatbar_id?: number }) {
  const chatbar_id = props.chatbar_id || 0;
  const email = localStorage.getItem("email") || "";
  const { data: chats } = useChatsByChatBarID(chatbar_id.toString());
  const { mutate: createChat } = useChatCreate();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [text, setText] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [done, setDone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    if (session) {
      navigate({ to: "/" });
    }
    return () => subscription.unsubscribe();
  }, []);

  useGSAP(() => {
    gsap.set(panelRef.current, { xPercent: -200, autoAlpha: 0 });
    tlRef.current = gsap.timeline({ paused: true }).to(panelRef.current, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power1",
    });
  }, []);
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        "#side-panel",
        {
          width: 0,
        },
        {
          width: "30%",
        },
      );
    } else {
      gsap.fromTo(
        "#side-panel",
        {
          width: "30%",
        },
        {
          width: 0,
        },
      );
    }
  }, [isOpen]);
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
      if (done) {
        setDone(true);
        break;
      }
      onChunk(decoder.decode(value, { stream: true }));
    }
  }
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
  const items = useMemo(() => {
    if (!chats) return [];
    return [...chats].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });
  }, [chats]);
  const handleChatSubmit = async (prompt: string) => {
    setText("");
    createChat({
      text: prompt,
      chatbar_id,
      email,
      role: "user",
    });
    streamAnswer(prompt, (chunk) => setText((prev) => prev + chunk));
    if (done === true) {
      createChat({
        text: text.toString(),
        chatbar_id,
        email,
        role: "assistant",
      });
    }
  };
  const renderChatSections = items.map((chat, index) => {
    const isPrompt = chat.role === "user";
    return (
      <div key={index} className="flex flex-col gap-2 w-auto h-auto">
        {isPrompt ? (
          <div className="flex justify-end">
            <PromptSection prompt={chat.text} />
          </div>
        ) : (
          <div className="flex justify-start">
            <AnswerPrompt answer={chat.text} />
          </div>
        )}
      </div>
    );
  });
  return (
    <>
      <div className="flex">
        <div id="side-panel" className="flex bg-black w-4/10">
          <aside
            ref={panelRef}
            id="chat-panel"
            aria-hidden={!isOpen}
            className="relative left-0 top-0 w-full pointer-events-auto"
          >
            <ChatsBar handleBtn={handleChatPanel} />
          </aside>
        </div>
        <div className="w-full flex flex-row h-full min-h-screen bg-black relative">
          <div>
            <Avatar />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
          <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
            <div
              className={`w-full ${isOpen ? "px-20" : "px-50"} flex flex-col gap-5 mt-20 justify-end`}
            >
              {renderChatSections}
              {prompt && (
                <div className="flex justify-end">
                  <PromptSection prompt={text} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5 justify-center items-center w-full h-full">
              <div
                className={`flex justify-center items-center w-full mt-10 ${chats && chats.length > 0 && "mb-20"}`}
              >
                <SearchBar searchBtn={(prompt) => handleChatSubmit(prompt)} />
              </div>
              {chats?.length === 0 && <ChatPanel />}
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
        </div>
      </div>
    </>
  );
}
export default ChatPage;
