import { useUserChatBarChats } from "src/query/chatbarchat";
import ChatShortcut from "./ChatShortcut";
import { useMemo } from "react";

interface Props {
  searchTerm: string;
}
const ChatBarChatList = ({ searchTerm }: Props) => {
  const email = localStorage.getItem("email") || "";
  const { data: chatbarchats, isLoading } = useUserChatBarChats(email);
  if (chatbarchats && isLoading) {
    return <div>Loading</div>;
  }
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
  }, [chatbarchats, searchTerm]);
  return (
    <div className="w-full">
      {items.map((chat) => (
        <div key={chat.id} className="w-full py-1.5 h-auto">
          <ChatShortcut id={chat.id} name={chat.chat_name} />
        </div>
      ))}
    </div>
  );
};
export default ChatBarChatList;
