import { useUserChatBarChats } from "src/query/chatbarchat";

const ChatBarChatList = (props: { searchTerm: string }) => {
  const email = localStorage.getItem("email") || "";
  const { data: chatbarchats, isLoading } = useUserChatBarChats(email);
  if (chatbarchats && isLoading) {
    return <div>Loading</div>;
  }
  return <></>;
};
export default ChatBarChatList;
