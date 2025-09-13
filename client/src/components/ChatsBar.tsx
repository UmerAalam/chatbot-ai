import ChatBarSearch from "./ChatBarSearch";
import { IoMdAdd } from "react-icons/io";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import AddAlert from "./AddAlert";
import FolderChats from "./FolderChats";
import { useChatBarChatCreate } from "src/query/chatbarchat";
import { useFolderCreate } from "src/query/folder";
import ChatBarChatList from "./ChatBarChatList";
import FoldersList from "./FoldersList";
interface Props extends HTMLAttributes<HTMLDivElement> {
  handleBtn?: () => void;
}
function ChatsBar({ handleBtn, ...rest }: Props) {
  const email = localStorage.getItem("email") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: createChat } = useChatBarChatCreate();
  const { mutate: createFolder } = useFolderCreate();
  const [showFolderAlert, setShowFolderAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const [showChatFolder, setShowChatFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState("");
  const handleChatSubmit = (text: string) => {
    createChat({
      chat_name: text,
      folder_id: "DEFAULT",
      email,
    });
    setShowChatAlert(false);
  };
  const handleChatSubmitByFolderID = (props: { text: string }) => {
    if (folderId)
      createChat({
        chat_name: props.text,
        folder_id: folderId,
        email,
      });
    setShowChatAlert(false);
  };
  const handleFolderSubmit = (name: string) => {
    createFolder({
      email,
      folder_name: name,
    });
    setShowFolderAlert(false);
  };
  const handleCancel = () => {
    setShowChatAlert(false);
    setShowFolderAlert(false);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  const handleShowChatFolder = (name: string) => {
    setFolderName(name);
    setShowChatFolder(!showFolderAlert);
  };
  return (
    <>
      {showFolderAlert && (
        <AddAlert
          isChat={false}
          cancelBtn={handleCancel}
          addBtn={(name) => handleFolderSubmit(name.toString())}
        />
      )}
      {showChatAlert && (
        <AddAlert
          isChat={true}
          cancelBtn={handleCancel}
          addBtn={(value) => handleChatSubmit(value.toString())}
        />
      )}
      {showChatFolder && showChatAlert && (
        <AddAlert
          isChat={true}
          cancelBtn={handleCancel}
          addBtn={(name) =>
            handleChatSubmitByFolderID({ text: name.toString() })
          }
        />
      )}
      <div
        {...rest}
        className="fixed left-0 top-0 w-1.4 overflow-y-scroll overflow-x-hidden px-3 h-screen bg-transparent
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-700/20
        [&::-webkit-scrollbar-track]:rounded-2xl
        [&::-webkit-scrollbar-thumb]:bg-gray-700/50
        [&::-webkit-scrollbar-thumb]:rounded-2xl
        [&::-webkit-scrollbar-track]:mt-2"
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
                <div className="flex gap-1 items-center p-3 h-8 w-auto justify-center rounded-full backdrop-blur-2xl">
                  {folderName}
                </div>
                <div className="flex gap-1 items-center p-1 rounded-full backdrop-blur-2xl">
                  <FaArrowLeft
                    onClick={() => setShowChatFolder(!showChatFolder)}
                    className="hover:bg-gray-700 text-white/80 rounded-full backdrop-blur-2xl p-1.5"
                    size={26}
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
                <div className="flex pt-0.5">Folders</div>
                <IoMdAdd
                  onClick={() => setShowFolderAlert(true)}
                  className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
                  size={24}
                />
              </>
            )}
          </div>
          {showChatFolder ? (
            <FolderChats folder_id={folderId} />
          ) : (
            <>
              <FoldersList
                searchTerm={searchTerm}
                showChatFolder={({ folder_id, name }) => {
                  handleShowChatFolder(name);
                  setFolderId(folder_id);
                }}
              />
              <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
                <div className="flex pt-0.5">Chats</div>
                <IoMdAdd
                  onClick={() => setShowChatAlert(true)}
                  className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
                  size={24}
                />
              </div>
              <ChatBarChatList searchTerm={searchTerm} />
            </>
          )}
        </div>
      </div>
      )
    </>
  );
}
export default ChatsBar;
