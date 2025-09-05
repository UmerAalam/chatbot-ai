import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useAppDispatch } from "src/app/hooks/hook";
import { deleteFolder, renameFolder } from "src/app/slices/foldersSlice";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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
    <div className="relative flex items-center text-white/80 font-semibold px-3 w-full h-12 bg-gray-700/50 rounded-2xl border-l-8 border-green-400 outline-2 outline-transparent hover:outline-white">
      {showDropdown && (
        <div className="absolute right-0 top-10 bg-gray-800/80 backdrop-blur-2xl text-white/90 rounded-lg shadow-lg border border-gray-700/50 w-40 z-10">
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
              dispatch(renameFolder({ oldName: props.name, newName: name }));
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
