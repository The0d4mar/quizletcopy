import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface FolderState {
  folderflag: boolean
}

const initialState: FolderState = {
  folderflag: false,
}

export const addFolderStore = createSlice({
  name: 'folderFlag',
  initialState,
  reducers: {
    folderModal: (state, action: PayloadAction<boolean>) => {
      state.folderflag = action.payload
    }
  },
})


export const { folderModal } = addFolderStore.actions

export default addFolderStore.reducer