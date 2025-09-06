import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { v4 as uuidv4 } from "uuid";

export interface Folder {
  id: string;
  name: string;
}
interface Rename {
  id: string;
  currentName: string;
  newName: string;
}
const initialState: Folder[] = [];
export const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    //Add Functions Here
    addFolder: (state, action: PayloadAction<string>) => {
      state.push({ id: uuidv4(), name: action.payload });
    },
    deleteFolder: (state, action: PayloadAction<string>) => {
      return state.filter((name) => name.id !== action.payload);
    },
    renameFolder: (state, action: PayloadAction<Rename>) => {
      return state.map((folder) =>
        folder.name === action.payload.currentName
          ? { ...folder, name: action.payload.newName }
          : folder,
      );
    },
  },
});

export const { addFolder, deleteFolder, renameFolder } = foldersSlice.actions;

export const getFolders = (state: RootState) => state.folders;

export default foldersSlice.reducer;
