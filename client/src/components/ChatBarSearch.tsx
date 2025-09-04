import { IoMdSearch } from "react-icons/io";
interface Props {
  searchHandle: (term: string) => void;
}
function ChatBarSearch({ searchHandle }: Props) {
  return (
    <div className="min-h-12 px-3 w-full bg-gray-700/20 backdrop-blur-2xl rounded-2xl">
      <div className="flex gap-3 justify-start h-full items-center">
        <IoMdSearch className="h-6 w-auto text-white/80" />
        <div className="h-6 w-px bg-gray-500/50" />
        <input
          className="text-white font-bold h-full w-[80%] border-none outline-none"
          placeholder="Search"
          onChange={(e) => searchHandle(e.target.value)}
        />
      </div>
    </div>
  );
}
export default ChatBarSearch;
