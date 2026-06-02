import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  state: boolean
}

const initialState: CounterState = {
  state: false,
}

export const modalStore = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalState: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { modalState } = modalStore.actions

export default modalStore.reducer