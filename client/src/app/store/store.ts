import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slices/chatSlice";
import foldersSlice from "../slices/foldersSlice";
import chatShortcutSlice from "../slices/chatShortcutSlice";
export const store = configureStore({
  reducer: {
    chats: chatReducer,
    folders: foldersSlice,
    chatsShortcut: chatShortcutSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
