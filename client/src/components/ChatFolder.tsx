import { HiDotsHorizontal } from "react-icons/hi";
function ChatFolder(props: { name: string }) {
  return (
    <div className="flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-green-500">
      <div className="w-full h-full items-center flex justify-between">
        {props.name}
        <HiDotsHorizontal
          className="text-white/80 rounded-full hover:bg-gray-700/50 p-1"
          size={24}
        />
      </div>
    </div>
  );
}
export default ChatFolder;
