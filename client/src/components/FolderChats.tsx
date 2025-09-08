import { useChatsByFolderID } from "src/query/chatbarchat";
import ChatShortcut from "./ChatShortcut";

const FolderChats = (props: { folder_id: string }) => {
  const { data: folderChats, isLoading } = useChatsByFolderID(props.folder_id);

  if (isLoading) return <div>Loading...</div>;

  const renderedChats = folderChats
    ?.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .map((chat, index) => (
      <div key={index} className="w-full py-1.5 h-auto">
        <ChatShortcut id={chat.id} name={chat.chat_name} />
      </div>
    ));

  return <div className="w-full">{renderedChats}</div>;
};

export default FolderChats;
