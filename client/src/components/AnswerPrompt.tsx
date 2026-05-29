import CopyToClipBoard from "./CopyToClipBoard";
import MarkdownRenderer from "./MarkdownRenderer";
function AnswerPrompt(props: { answer?: string }) {
  return (
    <div className="relative mr-auto w-full max-w-[65%] bg-gray-700/20 text-white/90 font-semibold flex justify-start z-0 items-start border-l-8 border-white/80 pl-3 pr-12 py-3 mt-3 h-auto min-h-12 rounded-2xl backdrop-blur-sm">
      <div className="min-w-0 w-full leading-relaxed">
        <MarkdownRenderer text={props.answer} />
      </div>
      {props.answer && (
        <CopyToClipBoard
          className="absolute top-3 right-3 cursor-pointer hover:bg-gray-700/50 p-1.5 rounded-md"
          textToCopy={props.answer}
        />
      )}
    </div>
  );
}
export default AnswerPrompt;
