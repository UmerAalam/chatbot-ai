import { useAppSelector } from "src/app/hooks/hook";
import { selectChatsByFolderId } from "src/app/selectors/selectors";
import { FolderChat } from "src/app/slices/folderChatsSlice";
import ChatShortcut from "./ChatShortcut";

interface Props {
  folderId: string;
  chatId: string;
}

const FolderChats = ({ folderId, chatId }: Props) => {
  const folderChats = useAppSelector((state) =>
    selectChatsByFolderId({ state, folderId }),
  );
  const renderedChats = folderChats.map((chat) => {
    return <ChatShortcut name={chat.} />;
  });
  return <div></div>;
};
export default FolderChats;
