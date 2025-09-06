import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slices/chatSlice";
import foldersSlice from "../slices/foldersSlice";
import chatShortcutSlice from "../slices/chatShortcutSlice";
import folderChatsSlice from "../slices/folderChatsSlice";
export const store = configureStore({
  reducer: {
    chats: chatReducer,
    folders: foldersSlice,
    chatsShortcut: chatShortcutSlice,
    folderChats: folderChatsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
