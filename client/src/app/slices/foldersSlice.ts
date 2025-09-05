import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface Folder {
  name: string;
}
interface Rename {
  oldName: string;
  newName: string;
}
const initialState: Folder[] = [];
export const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    //Add Functions Here
    addFolder: (state, action: PayloadAction<string>) => {
      state.push({ name: action.payload });
    },
    deleteFolder: (state, action: PayloadAction<string>) => {
      return state.filter((name) => name.name !== action.payload);
    },
    renameFolder: (state, action: PayloadAction<Rename>) => {
      return state.map((folder) =>
        folder.name === action.payload.oldName
          ? { ...folder, name: action.payload.newName }
          : folder,
      );
    },
  },
});

export const { addFolder, deleteFolder, renameFolder } = foldersSlice.actions;

export const getFolders = (state: RootState) => state.folders;

export default foldersSlice.reducer;
