import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    role: null
};

export const roleSlice = createSlice({
    name: 'role',

    initialState,
    reducers: {

        setRole: (state, action) => {
            state.role = action.payload.role;
        },
    }
})



export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;