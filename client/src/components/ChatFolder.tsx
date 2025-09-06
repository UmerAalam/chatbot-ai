import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useAppDispatch } from "src/app/hooks/hook";
import { deleteFolder, renameFolder } from "src/app/slices/foldersSlice";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface Props {
  id: string;
  currentName: string;
}

function ChatFolder({ id, currentName }: Props) {
  const [showDropdown, setShowDropDown] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(currentName);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
  const handleFolderDelete = (folderID: string) => {
    setShowDropDown(false);
    dispatch(deleteFolder(folderID));
  };
  const handleRenaming = () => {
    setShowDropDown(false);
    setIsRenaming(true);
  };
  return (
    <div className="relative cursor-pointer flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-green-400 outline-2 outline-transparent hover:outline-white">
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
              onClick={() => handleFolderDelete(id)}
              className="flex justify-start items-center px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b-lg text-red-400 hover:text-red-300"
            >
              Delete
              <MdDelete className="ml-2 mb-0.5 flex" size={16} />
            </li>
          </ul>
        </div>
      )}
      <div className="w-full h-full items-center flex justify-between">
        {isRenaming ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          name
        )}
        {isRenaming ? (
          <FaCheck
            onClick={() => {
              dispatch(renameFolder({ id, currentName, newName: name }));
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
