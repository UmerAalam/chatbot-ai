import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface ChatsShortcut {
  name: string;
}
interface Rename {
  currentName: string;
  newName: string;
}
const initialState: ChatsShortcut[] = [];
export const chatShortcutsSlice = createSlice({
  name: "chatShortcuts",
  initialState,
  reducers: {
    //Add Functions Here
    addChat: (state, action: PayloadAction<string>) => {
      state.push({ name: action.payload });
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      return state.filter((name) => name.name !== action.payload);
    },
    renameChat: (state, action: PayloadAction<Rename>) => {
      return state.map((chat) =>
        chat.name === action.payload.currentName
          ? { ...chat, name: action.payload.newName }
          : chat,
      );
    },
  },
});

export const { addChat, deleteChat, renameChat } = chatShortcutsSlice.actions;

export const getChatsShortcut = (state: RootState) => state.folders;

export default chatShortcutsSlice.reducer;
