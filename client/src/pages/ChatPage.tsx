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
import Avatar from "src/components/Avatar";
import { Chat, useChatCreate, useChatsByChatBarID } from "src/query/chats";
import { useAppDispatch, useAppSelector } from "src/app/hooks/hook";
import { addChatToChats, clearChats, getChats } from "src/app/slices/chatSlice";
import { useAuth } from "src/lib/FetchUser";
import { AppSettings, loadSettings, saveSettings } from "src/lib/settings";
import { useNavigate } from "@tanstack/react-router";
import { client } from "src/lib/client";
import {
  generateThreadId,
  getChatbarIdForThreadId,
  setThreadIdForChatbar,
} from "src/lib/threadId";

const pendingPromptKey = (threadId: string) => `pending_prompt_${threadId}`;

const getChatTitleFromPrompt = (prompt: string) => {
  const words = prompt
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "New Chat";
  return words.slice(0, 4).join(" ");
};

function ChatPage(props: { chatbar_id?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const chatbar_id = props.chatbar_id || "";
  const isHomePage = chatbar_id === "";
  const resolvedChatbarId = isHomePage ? "" : getChatbarIdForThreadId(chatbar_id);
  const { data: chats } = useChatsByChatBarID(resolvedChatbarId);
  const localChats = useAppSelector(getChats);
  const dispatch = useAppDispatch();
  const createChat = useChatCreate();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [text, setText] = useState("");
  const [initialChats, setInitialChats] = useState<Chat[]>([]);
  const handledPendingPrompt = useRef(false);
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  useEffect(() => {
    setSettings(loadSettings());
  }, []);
  useEffect(() => {
    if (chats) {
      const sorted = [...chats].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      });
      dispatch(clearChats());
      setInitialChats(sorted);
    }
  }, [chats, chatbar_id, props.chatbar_id, dispatch]);
  useEffect(() => {
    if (isHomePage || handledPendingPrompt.current) return;
    const queued = sessionStorage.getItem(pendingPromptKey(chatbar_id));
    if (!queued || queued.trim().length === 0) return;
    handledPendingPrompt.current = true;
    sessionStorage.removeItem(pendingPromptKey(chatbar_id));
    void handleChatSubmit(queued);
  }, [isHomePage, chatbar_id]);
  useGSAP(() => {
    gsap.set(panelRef.current, { xPercent: -200, autoAlpha: 0 });
    tlRef.current = gsap.timeline({ paused: true }).to(panelRef.current, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power1",
    });
  }, []);
  const streamAnswer = async (
    prompt: string,
    onChunk: (s: string) => void,
  ): Promise<string> => {
    let final = "";
    const settings = loadSettings();
    const res = await fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        apiKey: settings.apiKey,
        databaseUrl: settings.databaseUrl,
        ollamaUrl: settings.ollamaUrl,
        modelProvider: settings.modelProvider,
        openaiModel: settings.openaiModel,
        openrouterModel: settings.openrouterModel,
        openrouterBaseUrl: settings.openrouterBaseUrl,
        ollamaModel: settings.ollamaModel,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(detail || `Request failed with status ${res.status}`);
    }
    if (!res.body) throw new Error("No body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      final += chunk;
      onChunk(chunk);
    }
    return final;
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
  const parseModels = (value: string) => {
    const models = value
      .split(/[\n,]/)
      .map((m) => m.trim())
      .filter(Boolean);
    return models.length > 0 ? models : [value.trim()].filter(Boolean);
  };
  const modelOptions = [
    ...parseModels(settings.openaiModel).map((model) => ({
      provider: "openai" as const,
      model,
      key: `openai::${model}`,
      label: `OpenAI - ${model}`,
    })),
    ...parseModels(settings.openrouterModel).map((model) => ({
      provider: "openrouter" as const,
      model,
      key: `openrouter::${model}`,
      label: `OpenRouter - ${model}`,
    })),
    ...parseModels(settings.ollamaModel).map((model) => ({
      provider: "ollama" as const,
      model,
      key: `ollama::${model}`,
      label: `Ollama - ${model}`,
    })),
  ];
  const selectedModel =
    settings.modelProvider === "openai"
      ? settings.openaiModel
      : settings.modelProvider === "openrouter"
        ? settings.openrouterModel
        : settings.ollamaModel;
  const selectedKey = `${settings.modelProvider}::${selectedModel}`;
  const handleModelChange = (value: string) => {
    const [provider, model] = value.split("::");
    const next =
      provider === "openai"
        ? { ...settings, modelProvider: "openai" as const, openaiModel: model }
        : provider === "openrouter"
          ? {
              ...settings,
              modelProvider: "openrouter" as const,
              openrouterModel: model,
            }
          : { ...settings, modelProvider: "ollama" as const, ollamaModel: model };
    setSettings(next);
    saveSettings(next);
  };
  const handleChatSubmit = async (text: string) => {
    const userText = text.trim();
    if (!userText) return;
    let targetChatbarId = resolvedChatbarId;
    if (isHomePage) {
      const res = await client.api.chatbarchat.$post({
        json: {
          chat_name: getChatTitleFromPrompt(userText),
          folder_id: "DEFAULT",
          email: user?.email || "",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create chat");
      }
      const data = (await res.json()) as Array<{ id: number }>;
      const first = data?.[0];
      if (!first?.id) {
        throw new Error("Failed to open chat");
      }
      const threadId = generateThreadId();
      setThreadIdForChatbar(first.id, threadId);
      sessionStorage.setItem(pendingPromptKey(threadId), userText);
      navigate({ to: "/chat/$chatId", params: { chatId: threadId } });
      return;
    }
    let role: "user" | "assistant" = "user"; // default role
    if (localChats.length > 0) {
      const last = localChats[localChats.length - 1];
      role = last.role === "user" ? "assistant" : "user";
    }
    dispatch(
      addChatToChats({
        text: userText,
        chatbar_id: targetChatbarId,
        email: user?.email || "",
        role,
      }),
    );
    setText("");
    await createChat({
      text: userText,
      chatbar_id: String(
        isHomePage ? getChatbarIdForThreadId(targetChatbarId) : targetChatbarId,
      ),
      email: user?.email,
      role: "user",
    });
    try {
      const final = await streamAnswer(userText, (chunk) =>
        setText((prev) => prev + chunk),
      );
      dispatch(
        addChatToChats({
          text: final,
          chatbar_id: targetChatbarId,
          email: user?.email || "",
          role: "assistant",
        }),
      );
      setText("");
      await createChat({
        text: final,
        chatbar_id: String(
          isHomePage ? getChatbarIdForThreadId(targetChatbarId) : targetChatbarId,
        ),
        email: user?.email,
        role: "assistant",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get assistant response";
      setText("");
      dispatch(
        addChatToChats({
          text: message,
          chatbar_id: targetChatbarId,
          email: user?.email || "",
          role: "assistant",
        }),
      );
    }
  };
  const items = useMemo(() => {
    if (!initialChats) return [];
    return [...initialChats].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });
  }, [props.chatbar_id, initialChats]);
  const renderChatSections = items.map((chat) => {
    const isPrompt = chat.role === "user";
    const key = chat.id ?? `${chat.created_at}-${chat.role}`;
    return (
      <div key={key} className="flex flex-col gap-2 w-auto h-auto">
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
  const localChat = localChats.map((chat) => {
    const isPrompt = chat.role === "user";
    const key = chat.id ?? `${chat.created_at}-${chat.role}`;
    return (
      <div key={key} className="flex flex-col gap-2 w-auto h-auto">
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
      <div className="flex bg-black min-h-screen">
        <aside
          ref={panelRef}
          id="chat-panel"
          aria-hidden={!isOpen}
          className={`fixed left-0 top-0 z-40 h-screen ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <ChatsBar handleBtn={handleChatPanel} disabled={!isOpen} />
        </aside>
        <div
          className={`w-full flex flex-row h-full min-h-screen bg-black relative transition-[margin] duration-300 ${isOpen ? "ml-[360px]" : "ml-12"}`}
        >
          <div>
            <Avatar />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.4),_transparent_40%)]"></div>
          <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
            <div className="w-full px-12 md:px-20 lg:px-50 flex flex-col gap-5 mt-20 justify-end">
              {initialChats.length > 0 && renderChatSections}
              {localChat}
              {text !== "" && (
                <div className="flex justify-start">
                  <AnswerPrompt answer={text} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5 justify-center items-center w-full h-full">
              <div
                className={`flex justify-center items-center w-full mt-10 ${chats && chats.length > 0 && "mb-20"}`}
              >
                <div className="w-full flex flex-col items-center gap-2">
                  <SearchBar searchBtn={(prompt) => handleChatSubmit(prompt)} />
                  <div className="w-[40%] flex justify-end">
                    <select
                      value={selectedKey}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="h-9 px-3 rounded-xl bg-gray-700/30 backdrop-blur-sm border border-gray-700/40 text-white text-sm"
                    >
                      {modelOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {chats?.length === 0 && <ChatPanel />}
            </div>
          </div>
          {!isOpen && (
            <div className="fixed top-0 left-0 z-30 h-screen w-12 bg-slate-950/95 backdrop-blur-md border-r border-white/10">
              <Button
                onClick={handleChatPanel}
                id="arrow-Btn"
                className="absolute top-5 left-2 bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl"
              >
                <FaArrowRight className="text-white/80" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default ChatPage;
