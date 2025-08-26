import { HiDotsHorizontal } from "react-icons/hi";
function ChatShortcut(props: { name: string }) {
  return (
    <div className="flex justify-between items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl ">
      {props.name}
      <HiDotsHorizontal
        className="text-white/80 rounded-full hover:bg-gray-700/50 p-1"
        size={24}
      />
    </div>
  );
}
export default ChatShortcut;
