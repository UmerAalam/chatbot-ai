import { HashLoader } from "react-spinners";

function AnswerPrompt(props: { answer?: string }) {
  return (
    <div className="bg-gray-700/20 text-white/90 font-bold flex justify-start max-w-2/3 min-w-auto items-center border-l-8 border-white/80 pl-3 pr-5 py-3 mt-3 h-auto min-h-12 rounded-2xl">
      {props.answer === undefined ? (
        <HashLoader size={20} color="#ffffff" />
      ) : (
        <>{props.answer}</>
      )}
    </div>
  );
}
export default AnswerPrompt;
