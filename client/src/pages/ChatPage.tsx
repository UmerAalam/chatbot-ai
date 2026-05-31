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

const TEMP_CHAT_ID = "TEMP_SESSION_CHAT";
const TEMP_CHAT_MODE_KEY = "temp_chat_mode";

const getChatTitleFromPrompt = (prompt: string) => {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "New Chat";
  return words.slice(0, 4).join(" ");
};

const isAssistantWarningMessage = (text: string) =>
  /(api key is required|failed to|get assistant response|request failed|no body|session is still loading)/i.test(
    text.trim(),
  );

const hideResolvedAssistantWarnings = <T extends { role: string; text: string }>(
  chats: T[],
  modelProvider?: AppSettings["modelProvider"],
) => {
  let hasLaterSuccessfulAssistant = false;
  const kept: T[] = [];

  for (let i = chats.length - 1; i >= 0; i -= 1) {
    const chat = chats[i];
    if (chat.role === "assistant") {
      const isWarning = isAssistantWarningMessage(chat.text);
      const isApiKeyWarning = /api key is required/i.test(chat.text.trim());
      if (isApiKeyWarning && modelProvider === "ollama") {
        continue;
      }
      if (isWarning && hasLaterSuccessfulAssistant) {
        continue;
      }
      if (!isWarning) {
        hasLaterSuccessfulAssistant = true;
      }
    }
    kept.push(chat);
  }

  return kept.reverse();
};

function ChatPage(props: { chatbar_id?: string }) {
  const { user, loading } = useAuth();
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
  const [showMoveToTop, setShowMoveToTop] = useState(false);
  const [initialChats, setInitialChats] = useState<Chat[]>([]);
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(TEMP_CHAT_MODE_KEY);
    setIsTemporaryChat(raw === "1");
  }, []);
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  useEffect(() => {
    setSettings(loadSettings());
  }, []);
  useEffect(() => {
    // Only reset optimistic state when thread changes.
    dispatch(clearChats());
    setInitialChats([]);
  }, [chatbar_id, dispatch]);

  useEffect(() => {
    if (!chats) return;
    if (isTemporaryChat) return;
    const sorted = [...chats].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });
    setInitialChats(sorted);
  }, [chats, isTemporaryChat]);
  useEffect(() => {
    const onScroll = () => {
      setShowMoveToTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
  const streamAnswer = async (
    prompt: string,
    onChunk: (s: string) => void,
    signal?: AbortSignal,
  ): Promise<string> => {
    let final = "";
    const settings = loadSettings();
    const res = await fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
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
    if (isGenerating) return;
    const userText = text.trim();
    if (!userText) return;
    if (!isTemporaryChat && (loading || !user?.email)) {
      dispatch(
        addChatToChats({
          text: "Session is still loading. Please try again in a moment.",
          chatbar_id: resolvedChatbarId,
          email: "",
          role: "assistant",
        }),
      );
      return;
    }
    let targetChatbarId = isTemporaryChat ? TEMP_CHAT_ID : resolvedChatbarId;
    if (!isTemporaryChat && isHomePage) {
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
      targetChatbarId = String(first.id);
      navigate({ to: "/chat/$chatId", params: { chatId: threadId } });
    }
    dispatch(
      addChatToChats({
        text: userText,
        chatbar_id: targetChatbarId,
        email: user?.email || "",
        role: "user",
      }),
    );
    setText("");
    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    let partialText = "";
    if (isTemporaryChat) {
      try {
        const final = await streamAnswer(userText, (chunk) =>
          setText((prev) => {
            const next = prev + chunk;
            partialText = next;
            return next;
          }),
          controller.signal,
        );
        dispatch(
          addChatToChats({
            text: final,
            chatbar_id: targetChatbarId,
            email: "",
            role: "assistant",
          }),
        );
        setText("");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          if (partialText.trim().length > 0) {
            dispatch(
              addChatToChats({
                text: partialText,
                chatbar_id: targetChatbarId,
                email: "",
                role: "assistant",
              }),
            );
          }
          setText("");
          return;
        }
        const message =
          error instanceof Error ? error.message : "Failed to get assistant response";
        setText("");
        dispatch(
          addChatToChats({
            text: message,
            chatbar_id: targetChatbarId,
            email: "",
            role: "assistant",
          }),
        );
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsGenerating(false);
      }
      return;
    }
    try {
      await createChat({
        text: userText,
        chatbar_id: String(
          isHomePage ? getChatbarIdForThreadId(targetChatbarId) : targetChatbarId,
        ),
        email: user?.email,
        role: "user",
      });
      const final = await streamAnswer(userText, (chunk) =>
        setText((prev) => {
          const next = prev + chunk;
          partialText = next;
          return next;
        }),
        controller.signal,
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
      if (error instanceof Error && error.name === "AbortError") {
        if (partialText.trim().length > 0) {
          dispatch(
            addChatToChats({
              text: partialText,
              chatbar_id: targetChatbarId,
              email: user?.email || "",
              role: "assistant",
            }),
          );
          await createChat({
            text: partialText,
            chatbar_id: String(
              isHomePage ? getChatbarIdForThreadId(targetChatbarId) : targetChatbarId,
            ),
            email: user?.email,
            role: "assistant",
          });
        }
        setText("");
        return;
      }
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
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
    }
  };
  const handleStop = () => {
    abortControllerRef.current?.abort();
  };
  const items = useMemo(() => {
    if (!initialChats) return [];
    return [...initialChats].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });
  }, [props.chatbar_id, initialChats]);
  const visibleItems = useMemo(
    () => hideResolvedAssistantWarnings(items, settings.modelProvider),
    [items, settings.modelProvider],
  );
  const localFilterId = isTemporaryChat ? TEMP_CHAT_ID : resolvedChatbarId;
  const renderChatSections = visibleItems.map((chat) => {
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
  const localVisibleChats = hideResolvedAssistantWarnings(
    localChats
      .filter((chat) => String(chat.chatbar_id ?? "") === String(localFilterId))
      .filter((chat) => {
        // Hide optimistic entries once the same persisted message exists.
        if (isTemporaryChat) return true;
        return !initialChats.some(
          (saved) => saved.role === chat.role && saved.text === chat.text,
        );
      }),
    settings.modelProvider,
  );
  const localChat = localVisibleChats.map((chat) => {
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
  const hasRenderedChats =
    (!isTemporaryChat && initialChats.length > 0) ||
    localChat.length > 0 ||
    text.trim().length > 0;
  const handleMoveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <div className="flex bg-black min-h-screen overflow-x-hidden">
        <aside
          ref={panelRef}
          id="chat-panel"
          aria-hidden={!isOpen}
          className={`fixed left-0 top-0 z-40 h-screen ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <ChatsBar handleBtn={handleChatPanel} disabled={!isOpen} />
        </aside>
        <div
          className={`w-full flex flex-row h-full min-h-screen bg-black relative transition-[padding] duration-300 ${isOpen ? "pl-[360px]" : "pl-12"}`}
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
                  <SearchBar
                    searchBtn={(prompt) => handleChatSubmit(prompt)}
                    isGenerating={isGenerating}
                    onStop={handleStop}
                  />
                  <div className="w-[40%] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTemporaryChat((prev) => {
                          const next = !prev;
                          window.sessionStorage.setItem(
                            TEMP_CHAT_MODE_KEY,
                            next ? "1" : "0",
                          );
                          dispatch(clearChats());
                          setInitialChats([]);
                          setText("");
                          return next;
                        });
                      }}
                      className={`h-9 rounded-xl px-3 text-sm border transition-colors flex items-center gap-2 ${
                        isTemporaryChat
                          ? "bg-amber-500/15 text-amber-200 border-amber-400/60"
                          : "bg-[#041321]/90 text-slate-200 border-white/20 hover:border-white/35"
                      }`}
                    >
                      <span>Temp Chat</span>
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          isTemporaryChat ? "bg-amber-400/80" : "bg-slate-600/80"
                        }`}
                        aria-hidden="true"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            isTemporaryChat ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                    </button>
                    <select
                      value={selectedKey}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="theme-select h-9 rounded-xl bg-[#041321]/90 backdrop-blur-sm border border-emerald-500/55 text-white text-sm shadow-[0_0_0_1px_rgba(16,185,129,0.20)] hover:border-emerald-400/70 focus:border-emerald-300/80 focus:outline-none"
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
              {!hasRenderedChats && <ChatPanel />}
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
          {showMoveToTop && (
            <Button
              onClick={handleMoveToTop}
              className="fixed bottom-6 right-6 z-40 rounded-full h-11 w-11 bg-slate-900/90 border border-white/20 hover:bg-slate-800 text-white shadow-lg"
              aria-label="Move to top"
            >
              ↑
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
export default ChatPage;
