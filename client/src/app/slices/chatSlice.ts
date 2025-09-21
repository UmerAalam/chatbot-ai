import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface Chat {
  id?: number;
  text: string;
  chatbar_id?: number;
  created_at?: string;
  email: string;
  role: string;
}
const initialState: Chat[] = [];
export const chatsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addChatToChats: (state, action: PayloadAction<Chat>) => {
      state.push(action.payload);
    },
  },
});

export const { addChatToChats } = chatsSlice.actions;

export const getChats = (state: RootState) => state.chats;

export default chatsSlice.reducer;
