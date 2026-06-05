import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  state: boolean
}

const initialState: CounterState = {
  state: false,
}

export const EditFolderName = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    foldernameflag: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { foldernameflag } = EditFolderName.actions

export default EditFolderName.reducer