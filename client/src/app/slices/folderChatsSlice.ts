import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FolderChat {
  folderId: string;
  chatId: string;
}
interface RenameFolderChat {
  folderId: string;
  chatId: string;
  name: string;
}
const initialState: FolderChat[] = [];
export const folderChatsSlice = createSlice({
  name: "chatShortcuts",
  initialState,
  reducers: {
    addChatToFolder: (state, action: PayloadAction<FolderChat>) => {
      state.push({
        chatId: action.payload.chatId,
        folderId: action.payload.folderId,
      });
    },
    deleteChatFromFolder: (state, action: PayloadAction<FolderChat>) => {
      return state.filter(
        (folder) =>
          folder.chatId !== action.payload.chatId ||
          folder.folderId !== action.payload.folderId,
      );
    },
    renameChatFromFolder: (state, action: PayloadAction<RenameFolderChat>) => {
      return state.map((chat) =>
        chat.chatId === action.payload.chatId &&
        chat.folderId === action.payload.folderId
          ? { ...chat, newName: action.payload.name }
          : chat,
      );
    },
  },
});

export const { addChatToFolder, deleteChatFromFolder, renameChatFromFolder } =
  folderChatsSlice.actions;

export default folderChatsSlice.reducer;
