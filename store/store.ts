import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modalStore'
import addFolderStore  from './addFolderStore'
import folderStore from './folderStore'
import AddDeckToFolderStore  from './AddDeckToFolderStore'
import  EditFolderName  from './EditFolderName'
import deckStore from './deckStore'
import cardStore from './cardStore'
import cardDataReducer from './cardDataStore'
export const store = configureStore({
  reducer: {

    modal: modalReducer,
    folderFlag: addFolderStore,
    folders: folderStore,
    adddecktofolderflag: AddDeckToFolderStore,
    folderChangeNameFlag: EditFolderName,
    deckStore: deckStore,
    cardStore: cardStore,
    cardDataStore: cardDataReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch