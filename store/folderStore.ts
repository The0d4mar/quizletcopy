import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder } from '@/types/type';
import { loadFolders, saveFolders } from '@/storage';

type FoldersState = {
  folders: Folder[];
};

const initialState: FoldersState = {
  folders: typeof window !== 'undefined' ? loadFolders() : [],
};

const folderStore = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
      saveFolders(state.folders);
    },

    addFolder(state, action: PayloadAction<Folder>) {
      state.folders.push(action.payload);
      saveFolders(state.folders);
    },

    deleteFolder(state, action: PayloadAction<string>) {
      state.folders = state.folders.filter(
        folder => folder.id !== action.payload
      );
      saveFolders(state.folders);
    },
  },
});

export const { setFolders, addFolder, deleteFolder } = folderStore.actions;
export default folderStore.reducer;