import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import {
  useChatBarChatDelete,
  useChatBarChatRename,
} from "src/query/chatbarchat";
function ChatShortcut(props: { id?: number; name: string }) {
  const [showDropdown, setShowDropDown] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(props.name);
  const { mutate: deleteChat } = useChatBarChatDelete();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { mutate: renameChat } = useChatBarChatRename();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  const handleChatDelete = () => {
    props.id && deleteChat(props.id);
    setShowDropDown(false);
  };
  const handleRenaming = () => {
    setShowDropDown(false);
    setIsRenaming(true);
  };
  return (
    <div className="relative flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-white outline-2 outline-transparent hover:outline-white">
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-10 bg-gray-800/80 backdrop-blur-2xl text-white/90 rounded-lg shadow-lg border border-gray-700/50 w-40 z-10"
        >
          <ul className="flex flex-col text-sm">
            <li
              onClick={handleRenaming}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-lg"
            >
              Rename
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Move</li>
            <li
              onClick={() => handleChatDelete()}
              className="flex justify-start items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
            >
              Delete
              <MdDelete className="ml-2 mb-0.5 flex" size={18} />
            </li>
          </ul>
        </div>
      )}
      <div className="w-full h-full items-center flex justify-between">
        {isRenaming ? (
          <input
            className="bg-transparent outline-none border-b border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          name
        )}
        {isRenaming ? (
          <FaCheck
            onClick={() => {
              if (name.trim() === "") return;
              props.id &&
                renameChat({
                  id: props.id,
                  chat_name: name,
                });
              setIsRenaming(false);
            }}
            className="text-white/80 rounded-full hover:bg-gray-700/70 p-1 cursor-pointer"
            size={24}
          />
        ) : (
          <HiDotsHorizontal
            onClick={() => setShowDropDown(!showDropdown)}
            className="text-white/80 rounded-full hover:bg-gray-700/70 p-1 cursor-pointer"
            size={24}
          />
        )}
      </div>
    </div>
  );
}
export default ChatShortcut;
