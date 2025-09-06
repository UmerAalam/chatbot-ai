import { RootState } from "../store/store";

interface Props {
  state: RootState;
  folderId: string;
}
export const selectChatsByFolderId = ({ state, folderId }: Props) => {
  return state.folderChats.filter((chat) => chat.folderId === folderId);
};
