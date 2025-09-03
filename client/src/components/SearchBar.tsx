import { useAppDispatch } from "src/app/hooks/hook";
import { Button } from "@/components/ui/button";
import aiIcon from "../../public/icons8-ai.svg";
import { FaArrowRight } from "react-icons/fa";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { addAnswerToChat, addPromptToChat } from "src/app/slices/chatSlice";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePromptResult } from "src/modules/openaiQuery";
import useChatStream from "@magicul/react-chat-stream";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  searchBtn?: (prompt: string) => void;
}

function SearchBar({ searchBtn, ...rest }: Props) {
  const [multiLine, setMultiLine] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      const { scrollHeight } = textareaRef.current;
      const computedLineHeight = parseInt(
        window.getComputedStyle(textareaRef.current).lineHeight,
        10,
      );
      const lines = Math.floor(scrollHeight / computedLineHeight);
      setMultiLine(lines > 1);
      setPrompt(event.target.value);
    }
  };
  const fireSearch = async () => {
    const value = prompt;
    if (value.trim() === "") {
      return;
    }
    searchBtn && searchBtn(prompt);
    dispatch(addPromptToChat(prompt));
    setPromptValue(prompt);
    setPrompt("");
  };
  return (
    <>
      <div
        {...rest}
        className={`w-[40%] ${multiLine ? "h-auto" : "h-12"} rounded-2xl bg-gray-700/20 backdrop-blur-sm border-2 border-transparent hover:border-white/20`}
      >
        <div
          className={`flex min-h-8 flex-row w-full text-white py-2 font-bold justify-center ${
            multiLine ? "items-end" : "items-center"
          } gap-3`}
        >
          <img
            src={aiIcon}
            alt="AI"
            className="relative left-0 size-6 opacity-80"
          />
          <div className="h-6 w-px bg-gray-700/50" />
          <TextareaAutosize
            ref={textareaRef}
            onChange={handleChange}
            value={prompt}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setPrompt(e.currentTarget.value);
                fireSearch();
              }
            }}
            className="resize-none w-[80%] h-auto max-h-40 leading-8 border-none outline-none text-left placeholder:text-left [&::-webkit-scrollbar]:hidden"
            placeholder="Ask anything"
            maxRows={100}
          />
          <div className="h-6 w-px bg-gray-700/50" />
          <Button
            type="button"
            onClick={fireSearch}
            disabled={!prompt.trim()}
            className="bg-white/10 hover:bg-white/5 border-2 border-transparent hover:border-white/50 rounded-full p-3 w-8 h-8 backdrop-blur-2xl"
          >
            <FaArrowRight className="text-white/80" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
