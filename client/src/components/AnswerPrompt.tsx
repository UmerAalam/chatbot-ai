import CopyToClipBoard from "./CopyToClipBoard";
function AnswerPrompt(props: { answer?: string }) {
  return (
    <div className="mr-auto w-fit max-w-[75%] bg-gray-700/20 text-white/90 font-bold flex justify-start z-0 items-start border-l-8 border-white/80 pl-3 pr-5 py-3 mt-3 h-auto min-h-12 rounded-2xl backdrop-blur-sm">
      {props.answer}
      {props.answer && (
        <CopyToClipBoard
          className="cursor-pointer hover:bg-gray-700/50 p-1.5 rounded-md"
          textToCopy={props.answer}
        />
      )}
    </div>
  );
}
export default AnswerPrompt;
