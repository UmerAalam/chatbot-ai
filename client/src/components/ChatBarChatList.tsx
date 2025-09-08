import { useUserChatBarChats } from "src/query/chatbarchat";
import ChatShortcut from "./ChatShortcut";

interface Props {
  searchTerm: string;
}
const ChatBarChatList = ({ searchTerm }: Props) => {
  const email = localStorage.getItem("email") || "";
  const { data: chatbarchats, isLoading } = useUserChatBarChats(email);
  if (chatbarchats && isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="w-full">
      {!searchTerm.trim() &&
        chatbarchats
          ?.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateA - dateB;
          })
          .reverse()
          .map((chat, index) => {
            return (
              <div key={index} className="w-full py-1.5 h-auto">
                <ChatShortcut id={chat.id} name={chat.chat_name} />
              </div>
            );
          })}
      {searchTerm.trim() &&
        chatbarchats
          ?.filter((chat) =>
            chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateA - dateB;
          })
          .reverse()
          .map((chat) => (
            <div className="w-full py-1.5 h-auto" key={chat.id}>
              <ChatShortcut id={chat.id} name={chat.chat_name} />
            </div>
          ))}
    </div>
  );
};
export default ChatBarChatList;
