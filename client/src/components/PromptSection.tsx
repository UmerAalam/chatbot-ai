import CopyToClipBoard from "./CopyToClipBoard";
function PromptSection(props: { prompt?: string }) {
  return (
    <div className="bg-gray-700/20 text-white font-bold flex justify-start max-w-1/2 min-w-auto z-0 items-center border-l-8 border-green-400 pl-3 pr-5 h-auto min-h-12 rounded-2xl">
      {props.prompt}
      {props.prompt && (
        <CopyToClipBoard
          className="cursor-pointer hover:bg-gray-700/50 p-1.5 rounded-md"
          textToCopy={props.prompt}
        />
      )}
    </div>
  );
}
export default PromptSection;
