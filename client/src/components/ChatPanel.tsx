function ChatPanel() {
  return (
    <div className="h-60 w-[40%] rounded-3xl bg-gray-700/20 backdrop-blur-sm border-2 border-transparent hover:border-white/20">
      <div className="flex flex-col h-full w-full text-white font-bold justify-center items-center gap-3">
        <h1 className="text-4xl">How can i help you today?</h1>
        <div className="text-lg text-white/80">Ready when you are...</div>
        <div className="text-sm text-white/50 px-5 font-semibold">
          This AI chatbot can sometimes make mistakes or provide incomplete
          answers.
        </div>
        <div className="text-sm text-white/50 px-5 -mt-3 font-semibold">
          Always verify important information before relying on it.
        </div>
      </div>
    </div>
  );
}
export default ChatPanel;
