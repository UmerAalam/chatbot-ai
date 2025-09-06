import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { v4 as uuidv4 } from "uuid";

export interface ChatsShortcut {
  id: string;
  folderId: string;
  name: string;
}
interface Rename {
  chatId: string;
  name: string;
}
const initialState: ChatsShortcut[] = [];
export const chatShortcutsSlice = createSlice({
  name: "chatShortcuts",
  initialState,
  reducers: {
    //Add Functions Here
    addChat: (state, action: PayloadAction<ChatsShortcut>) => {
      state.push({
        id: uuidv4(),
        folderId: action.payload.folderId,
        name: action.payload.name,
      });
    },
    deleteChat: (state, action: PayloadAction<ChatsShortcut>) => {
      return state.filter((name) => name.id !== action.payload.id);
    },
    renameChat: (state, action: PayloadAction<Rename>) => {
      return state.map((chat) =>
        chat.id === action.payload.chatId
          ? { ...chat, name: action.payload.name }
          : chat,
      );
    },
  },
});

export const { addChat, deleteChat, renameChat } = chatShortcutsSlice.actions;

export const getChatsShortcut = (state: RootState) => state.folders;

export default chatShortcutsSlice.reducer;
