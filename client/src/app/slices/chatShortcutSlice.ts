import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface ChatsShortcut {
  name: string;
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
      state.filter((name) => name.name === action.payload);
    },
  },
});

export const { addChat, deleteChat } = chatShortcutsSlice.actions;

export const getChatsShortcut = (state: RootState) => state.folders;

export default chatShortcutsSlice.reducer;
