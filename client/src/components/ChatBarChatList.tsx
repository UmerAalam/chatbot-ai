import { useUserChatBarChats } from "src/query/chatbarchat";
import ChatShortcut from "./ChatShortcut";
import { useMemo } from "react";
import { useAuth } from "src/lib/FetchUser";
import { getThreadIdForChatbar } from "src/lib/threadId";
import { Loader2 } from "lucide-react";

interface Props {
  searchTerm: string;
}
const ChatBarChatList = ({ searchTerm }: Props) => {
  const { user } = useAuth();
  const email = user?.email || "";
  const { data: chatbarchats, isLoading } = useUserChatBarChats(email);
  const items = useMemo(() => {
    if (!chatbarchats) return [];
    const list = searchTerm.trim()
      ? chatbarchats.filter((c) =>
          c.chat_name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : chatbarchats;
    return [...list].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [searchTerm, chatbarchats]);
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-white/70" />
      </div>
    );
  }
  return (
    <div className="w-full">
      {items.map((chat) => (
        <div key={chat.id} className="w-full py-1.5 h-auto">
          <ChatShortcut id={chat.id} threadId={chat.id ? getThreadIdForChatbar(chat.id) : undefined} name={chat.chat_name} />
        </div>
      ))}
    </div>
  );
};
export default ChatBarChatList;
