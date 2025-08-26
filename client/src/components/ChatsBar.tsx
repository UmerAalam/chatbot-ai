import aiIcon from "../../public/icons8-ai.svg";
import { RiEqualizer2Line } from "react-icons/ri";
import ChatBarSearch from "./ChatBarSearch";
import ChatShortcut from "./ChatShortcut";
import ChatFolder from "./ChatFolder";
import { IoMdAdd } from "react-icons/io";

function ChatsBar() {
  return (
    <div className="absolute left-0 top-0 w-1/4 px-3 h-screen bg-transparent">
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
        <ChatBarSearch />
        <div className="text-white w-full px-2.5 flex justify-between items-center mt-3 font-semibold">
          Folders
          <IoMdAdd
            className="hover:bg-gray-700 text-white/80 rounded-full p-1 backdrop-blur-2xl"
            size={24}
          />
        </div>
        <div className="w-full">
          <ChatFolder name="Work Chats" />
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
