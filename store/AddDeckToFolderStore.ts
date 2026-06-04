import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  state: boolean
}

const initialState: CounterState = {
  state: false,
}

export const AddDeckToFolderStore = createSlice({
  name: 'adddeckfolder',
  initialState,
  reducers: {
    addDeckFolderFlag: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addDeckFolderFlag } = AddDeckToFolderStore.actions

export default AddDeckToFolderStore.reducer