import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useAppDispatch } from "src/app/hooks/hook";
import { deleteChat } from "src/app/slices/chatShortcutSlice";
function ChatShortcut(props: { name: string }) {
  const [showDropdown, setShowDropDown] = useState(false);
  const dispatch = useAppDispatch();
  const handleChatDelete = (chatName: string) => {
    console.log("Chat Deleted");
    dispatch(deleteChat(chatName));
  };
  return (
    <div className="flex justify-between items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl ">
      {showDropdown && (
        <div className="absolute -right-20 top-10 bg-gray-800 text-white/90 rounded-lg shadow-lg border border-gray-700 w-40 z-10">
          <ul className="flex flex-col text-sm">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-lg">
              Rename
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Move</li>
            <li
              onClick={() => handleChatDelete(props.name)}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
            >
              Delete
            </li>
          </ul>
        </div>
      )}
      {props.name}
      <HiDotsHorizontal
        className="text-white/80 rounded-full hover:bg-gray-700/50 p-1"
        size={24}
      />
    </div>
  );
}
export default ChatShortcut;
