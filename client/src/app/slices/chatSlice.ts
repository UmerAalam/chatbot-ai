import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface Chat {
  prompt: string | undefined;
  answer: string | undefined;
}
const initialState: Chat[] = [];
export const chatsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    //Add Functions Here
    addPromptToChat: (state, action: PayloadAction<string>) => {
      state.push({ prompt: action.payload, answer: undefined });
    },
    addAnswerToChat: (state, action: PayloadAction<string>) => {
      const last = state[state.length - 1];
      if (last) last.answer = action.payload;
    },
    addAnswerToChatAt: (
      state,
      action: PayloadAction<{ index: number; answer: string }>,
    ) => {
      const { index, answer } = action.payload;
      if (state[index]) state[index].answer = answer;
    },
  },
});

export const { addPromptToChat, addAnswerToChat } = chatsSlice.actions;

export const getChats = (state: RootState) => state.chats;

export default chatsSlice.reducer;
