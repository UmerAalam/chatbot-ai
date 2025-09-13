import { Button } from "@/components/ui/button";
import aiIcon from "../../public/icons8-ai.svg";
import { FaArrowRight } from "react-icons/fa";
import { useLayoutEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  searchBtn?: (prompt: string) => void;
}
function SearchBar({ searchBtn, ...rest }: Props) {
  const [multiLine, setMultiLine] = useState(false);
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const oneLineHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const prev = el.value;
    el.value = "x";
    requestAnimationFrame(() => {
      oneLineHeightRef.current = el.scrollHeight;
      el.value = prev;
    });
  }, []);

  const onHeightChange = (height: number) => {
    const base = oneLineHeightRef.current;
    if (base != null) setMultiLine(height > base + 1);
  };

  const fireSearch = async () => {
    const value = prompt;
    if (value.trim() === "") {
      return;
    }
    searchBtn && searchBtn(prompt);
    setPrompt("");
  };
  return (
    <>
      <div
        {...rest}
        className={`w-[40%] ${multiLine ? "h-auto min-h-12" : "h-12"} rounded-2xl bg-gray-700/20 backdrop-blur-sm border-2 border-transparent hover:border-white/20`}
      >
        <div
          className={`flex flex-row relative max-w-full text-white font-bold justify-center ${
            multiLine ? "items-end mb-2" : "min-h-8 items-center h-full"
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
            value={prompt}
            placeholder="Ask anything"
            onChange={(e) => setPrompt(e.target.value)}
            onHeightChange={onHeightChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setPrompt(e.currentTarget.value);
                fireSearch();
              }
            }}
            minRows={1}
            maxRows={100}
            className="resize-none w-[80%] h-auto max-h-40 leading-8 border-none outline-none text-left placeholder:text-left p-0 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-700/20
  [&::-webkit-scrollbar-track]:rounded-2xl
  [&::-webkit-scrollbar-thumb]:bg-gray-700/50
  [&::-webkit-scrollbar-thumb]:rounded-2xl
  [&::-webkit-scrollbar-track]:mt-2
            "
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
