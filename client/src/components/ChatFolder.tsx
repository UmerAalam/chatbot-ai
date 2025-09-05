import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useAppDispatch } from "src/app/hooks/hook";
import { deleteFolder } from "src/app/slices/foldersSlice";
import { FaCheck } from "react-icons/fa";

function ChatFolder(props: { name: string }) {
  const [showDropdown, setShowDropDown] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(props.name);
  const dispatch = useAppDispatch();
  const handleFolderDelete = (folderName: string) => {
    setShowDropDown(false);
    dispatch(deleteFolder(folderName));
  };
  const handleRenaming = () => {
    setShowDropDown(false);
    setIsRenaming(true);
  };
  return (
    <div className="relative flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-green-400">
      {showDropdown && (
        <div className="absolute right-0 top-10 bg-gray-800 text-white/90 rounded-lg shadow-lg border border-gray-700 w-40 z-10">
          <ul className="flex flex-col text-sm">
            <li
              onClick={handleRenaming}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-lg"
            >
              Rename
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Move</li>
            <li
              onClick={() => handleFolderDelete(props.name)}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
            >
              Delete
            </li>
          </ul>
        </div>
      )}
      <div className="w-full h-full items-center flex justify-between">
        {isRenaming ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          props.name
        )}
        {isRenaming ? (
          <FaCheck
            onClick={() => {
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

export default ChatFolder;
