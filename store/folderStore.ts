import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getFolders as fetchFoldersFromApi } from "@/lib/api/foldersApi";
import { Folder } from "@/types/types.type";
import type { RootState } from "./store";

interface FoldersState {
  folders: Folder[];
  syncStatus?: "idle" | "loading" | "ready" | "fallback";
  error?: string;
}

const initialState: FoldersState = {
  folders: [],
  syncStatus: "idle",
};

export const syncFoldersWithApi = createAsyncThunk<
  Folder[],
  void,
  { state: RootState; rejectValue: string }
>("folders/syncWithApi", async (_, { rejectWithValue }) => {
  try {
    return await fetchFoldersFromApi();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Folder API is unavailable");
  }
});

const folderStore = createSlice({
  name: "folders",
  initialState,
  reducers: {
    hydrateFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
      state.syncStatus = "ready";
      state.error = undefined;
    },

    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },

    addFolder(state, action: PayloadAction<Folder>) {
      state.folders.push(action.payload);
    },

    deleteFolder(state, action: PayloadAction<string>) {
      state.folders = state.folders.filter((folder) => folder.id !== action.payload);
    },

    createFolderCopy(state, action: PayloadAction<{ folderId: string }>) {
      const foldersName = state.folders.map((folder) => folder.title);
      const folderToCopy = state.folders.find((folder) => folder.id === action.payload.folderId);

      if (!folderToCopy) return;

      let copyIndex = 1;
      let newTitle = `Copy: ${folderToCopy.title}`;

      while (foldersName.includes(newTitle)) {
        copyIndex++;
        newTitle = `Copy (${copyIndex}): ${folderToCopy.title}`;
      }

      const newFolder: Folder = {
        ...folderToCopy,
        id: crypto.randomUUID(),
        title: newTitle,
      };

      state.folders.push(newFolder);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncFoldersWithApi.pending, (state) => {
        state.syncStatus = "loading";
        state.error = undefined;
      })
      .addCase(syncFoldersWithApi.fulfilled, (state, action) => {
        state.folders = action.payload;
        state.syncStatus = "ready";
        state.error = undefined;
      })
      .addCase(syncFoldersWithApi.rejected, (state, action) => {
        state.syncStatus = "fallback";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { hydrateFolders, setFolders, addFolder, deleteFolder, createFolderCopy } = folderStore.actions;
export default folderStore.reducer;