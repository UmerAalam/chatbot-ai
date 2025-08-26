function AnswerPrompt(props: { answer?: string }) {
  return (
    <div className="bg-gray-700/20 text-white/90 font-bold flex justify-start w-1/2 items-center border-l-8 border-white/80 px-5 py-3 mt-3 outline-2 hover:outline-gray-700 h-auto min-h-12 rounded-2xl">
      {props.answer}
    </div>
  );
}
export default AnswerPrompt;
