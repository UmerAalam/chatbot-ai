import { IoMdSearch } from "react-icons/io";
interface Props {
  searchHandle: (term: string) => void;
}
function ChatBarSearch({ searchHandle }: Props) {
  return (
    <div className="relative w-full">
      <IoMdSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
      <input
        className="h-11 w-full rounded-lg pl-10 pr-3 bg-gray-800 border border-gray-700 text-white/90 font-semibold outline-none placeholder:text-white/40"
        placeholder="Search"
        onChange={(e) => searchHandle(e.target.value)}
      />
    </div>
  );
}
export default ChatBarSearch;
