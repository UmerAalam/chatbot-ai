import aiIcon from "../../public/icons8-ai.svg";
import { RiEqualizer2Line } from "react-icons/ri";
import ChatBarSearch from "./ChatBarSearch";
import ChatShortcut from "./ChatShortcut";
import ChatFolder from "./ChatFolder";
import { IoMdAdd } from "react-icons/io";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Props extends HTMLAttributes<HTMLDivElement> {
  handleBtn?: () => void;
}
function ChatsBar({ handleBtn, ...rest }: Props) {
  const [folders, setFolders] = useState<string[]>([
    "Work Folder",
    "Personal Folder",
    "Sports Folder",
  ]);
  const handleFolderSubmit = () => {
    setFolders((prev) => [...prev, "Work Work"]);
  };
  return (
    <div
      {...rest}
      className="absolute left-0 top-0 w-1/4 px-3 h-screen bg-transparent"
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
            <FaArrowLeft className="text-white/80 w-full" />
          </Button>
        </div>
        <ChatBarSearch />
        <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
          Folders
          <IoMdAdd
            onClick={handleFolderSubmit}
            className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
            size={24}
          />
        </div>
        <div className="w-full">
          {folders.map((folder) => {
            return (
              <div className="w-full py-1.5 h-auto">
                <ChatFolder name={folder} />
              </div>
            );
          })}
        </div>
        <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
          Chats
          <IoMdAdd
            className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
            size={24}
          />
        </div>
        <div className="w-full">
          <ChatShortcut name="Lorem Ipsum" />
        </div>
      </div>
    </div>
  );
}
export default ChatsBar;
