import { configureStore } from '@reduxjs/toolkit'
import roleReducer from './roleSlice'
import countReducer from './counteSlice'

export const store = configureStore({
    reducer: {
        role: roleReducer,
        count: countReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch