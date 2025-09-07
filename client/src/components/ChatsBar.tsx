import ChatBarSearch from "./ChatBarSearch";
import ChatFolder from "./ChatFolder";
import { IoMdAdd } from "react-icons/io";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import AddAlert from "./AddAlert";
import { addFolder, Folder } from "src/app/slices/foldersSlice";
import { useAppDispatch, useAppSelector } from "src/app/hooks/hook";
import { type ChatsShortcut } from "src/app/slices/chatShortcutSlice";
import ChatShortcut from "./ChatShortcut";
import FolderChats from "./FolderChats";
import { useChatBarChatPost } from "src/query/chatbarchat";
import { getUser } from "src/supabase-client/supabase-client";

interface Props extends HTMLAttributes<HTMLDivElement> {
  handleBtn?: () => void;
}
function ChatsBar({ handleBtn, ...rest }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const email = localStorage.getItem("email") || "";
  const dispatch = useAppDispatch();
  const folders: Folder[] = useAppSelector((state) => state.folders);
  const chatsShortcut: ChatsShortcut[] = useAppSelector(
    (state) => state.chatsShortcut,
  );
  const [showFolderAlert, setShowFolderAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const [showChatFolder, setShowChatFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { mutate } = useChatBarChatPost();
  const handleChatSubmit = (text: string) => {
    mutate({
      chat_name: text,
      email,
    });
    setShowChatAlert(false);
  };
  const handleFolderSubmit = () => {
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
  const handleShowChatFolder = (folder: Folder) => {
    setShowChatFolder(!showFolderAlert);
    setFolderName(folder.name);
  };
  return (
    <>
      {showFolderAlert && <AddAlert isChat={false} cancelBtn={handleCancel} />}
      {showChatAlert && (
        <AddAlert
          isChat={true}
          cancelBtn={handleCancel}
          addBtn={(value) => handleChatSubmit(value.toString())}
        />
      )}
      {showChatFolder && showChatAlert && (
        <AddAlert isChat={true} cancelBtn={handleCancel} />
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
        <div className="flex justify-between gap-3 px-4.5 items-center mt-5 w-full h-12 rounded-2xl bg-gray-700/20 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBtn}
              id="arrow-Btn"
              className={`bg-gray-700/20 border-2 border-transparent hover:border-gray-700/50 hover:bg-white/10 rounded-full size-8 backdrop-blur-2xl`}
            >
              <FaArrowLeft className="text-white/80 w-fit" />
            </Button>
            <div className="h-6 w-px bg-gray-500/50" />
            <div className="text-white/80 font-bold">My Chats</div>
          </div>
        </div>
        <div className="flex flex-col py-5 justify-start gap-3 px-3 items-start mt-5 w-full h-[87%] rounded-2xl bg-gray-700/20 backdrop-blur-2xl">
          <ChatBarSearch searchHandle={handleSearch} />
          <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
            {showChatFolder ? (
              <div className="flex w-full justify-between items-center">
                {folderName}
                <div className="flex gap-3 items-center">
                  <FaArrowLeft
                    onClick={() => setShowChatFolder(!showChatFolder)}
                    className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
                    size={24}
                  />
                  <IoMdAdd
                    onClick={() => setShowChatAlert(true)}
                    className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
                    size={24}
                  />
                </div>
              </div>
            ) : (
              <>
                Folders
                <IoMdAdd
                  onClick={() => setShowFolderAlert(true)}
                  className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
                  size={24}
                />
              </>
            )}
          </div>
          {showChatFolder ? (
            <FolderChats />
          ) : (
            <>
              <div className="w-full">
                {!searchTerm.trim() &&
                  folders.map((folder, index) => {
                    return (
                      <div
                        onClick={() => handleShowChatFolder(folder)}
                        key={index}
                        className="w-full py-1.5 h-auto"
                      >
                        <ChatFolder id={folder.id} currentName={folder.name} />
                      </div>
                    );
                  })}
                {searchTerm.trim() &&
                  folders
                    .filter((folder) =>
                      folder.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((folder, index) => (
                      <div
                        onClick={() => handleShowChatFolder(folder)}
                        className="w-full py-1.5 h-auto"
                        key={index}
                      >
                        <ChatFolder id={folder.id} currentName={folder.name} />
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
                      chat.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((chat) => (
                      <div className="w-full py-1.5 h-auto" key={chat.name}>
                        <ChatShortcut name={chat.name} />
                      </div>
                    ))}
              </div>
            </>
          )}
        </div>
      </div>
      )
    </>
  );
}
export default ChatsBar;
