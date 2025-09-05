import aiIcon from "../../public/icons8-ai.svg";
import { RiEqualizer2Line } from "react-icons/ri";
import ChatBarSearch from "./ChatBarSearch";
import ChatFolder from "./ChatFolder";
import { IoMdAdd } from "react-icons/io";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import AddAlert from "./AddAlert";
import { addFolder, deleteFolder, Folder } from "src/app/slices/foldersSlice";
import { useAppDispatch, useAppSelector } from "src/app/hooks/hook";
import {
  addChat,
  type ChatsShortcut,
  deleteChat,
} from "src/app/slices/chatShortcutSlice";
import ChatShortcut from "./ChatShortcut";

interface Props extends HTMLAttributes<HTMLDivElement> {
  handleBtn?: () => void;
}
function ChatsBar({ handleBtn, ...rest }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const folders: Folder[] = useAppSelector((state) => state.folders);
  const chatsShortcut: ChatsShortcut[] = useAppSelector(
    (state) => state.chatsShortcut,
  );
  const [showFolderAlert, setShowFolderAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const handleChatSubmit = (chatName: string) => {
    dispatch(addChat(chatName));
    setShowChatAlert(false);
  };
  const handleFolderSubmit = (folderName: string) => {
    dispatch(addFolder(folderName));
    setShowFolderAlert(false);
  };
  const handleCancel = () => {
    setShowChatAlert(false);
    setShowFolderAlert(false);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  return (
    <>
      {showFolderAlert && (
        <AddAlert
          isChat={false}
          cancelBtn={handleCancel}
          addBtn={handleFolderSubmit}
        />
      )}
      {showChatAlert && (
        <AddAlert
          isChat={true}
          cancelBtn={handleCancel}
          addBtn={handleChatSubmit}
        />
      )}
      <div
        {...rest}
        className="absolute left-0 top-0 w-1.4 overflow-y-scroll overflow-x-hidden px-3 h-screen bg-transparent
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-700/20
        [&::-webkit-scrollbar-track]:rounded-2xl
        [&::-webkit-scrollbar-thumb]:bg-gray-700/50
        [&::-webkit-scrollbar-thumb]:rounded-2xl
        [&::-webkit-scrollbar-track]:mt-2
        "
      >
        <div className="flex justify-between gap-3 px-6 items-center mt-5 w-full h-12 rounded-2xl bg-gray-700/20 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <img className="h-5 w-auto opacity-80" src={aiIcon} />
            <div className="h-6 w-px bg-gray-500/50" />
            <div className="text-white/80 font-bold">My Chats</div>
          </div>
          <div>
            <RiEqualizer2Line className="text-white h-5 w-auto" />
          </div>
        </div>
        <div className="flex flex-col py-5 justify-start gap-3 px-3 items-start mt-5 w-full h-[87%] rounded-2xl bg-gray-700/20 backdrop-blur-2xl">
          <div className="absolute top-0 -right-12">
            <Button
              onClick={handleBtn}
              id="arrow-Btn"
              className={`bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full w-10 h-10 backdrop-blur-2xl`}
            >
              <FaArrowRight className="text-white/80 w-full" />
            </Button>
          </div>
          <ChatBarSearch searchHandle={handleSearch} />
          <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
            Folders
            <IoMdAdd
              onClick={() => setShowFolderAlert(true)}
              className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
              size={24}
            />
          </div>
          <div className="w-full">
            {!searchTerm.trim() &&
              folders.map((folder) => {
                return (
                  <div className="w-full py-1.5 h-auto">
                    <ChatFolder name={folder.name} />
                  </div>
                );
              })}
            {searchTerm.trim() &&
              folders
                .filter((folder) =>
                  folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((folder) => (
                  <div className="w-full py-1.5 h-auto" key={folder.name}>
                    <ChatFolder name={folder.name} />
                  </div>
                ))}
          </div>
          <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
            Chats
            <IoMdAdd
              onClick={() => setShowChatAlert(true)}
              className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
              size={24}
            />
          </div>
          <div className="w-full">
            {!searchTerm.trim() &&
              chatsShortcut.map((chat) => {
                return (
                  <div className="w-full py-1.5 h-auto">
                    <ChatShortcut name={chat.name} />
                  </div>
                );
              })}
            {searchTerm.trim() &&
              chatsShortcut
                .filter((chat) =>
                  chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((chat) => (
                  <div className="w-full py-1.5 h-auto" key={chat.name}>
                    <ChatShortcut name={chat.name} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatsBar;
