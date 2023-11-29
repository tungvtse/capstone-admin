import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    count: 0,
    orderCount: 0,
    userCount: 0,
    partnerCount: 0
};

export const counterSlice = createSlice({
    name: 'count',

    initialState,
    reducers: {

        increaseCount: (state, action) => {
            // Increase the count by the payload value
            state.count += action.payload;
        },
        setOrderCount: (state, action) => {
            state.orderCount = action.payload.orderCount
        },
        setUserCount: (state, action) => {
            state.userCount = action.payload.userCount
        },
        setPartnerCount: (state, action) => {
            state.partnerCount = action.payload.partnerCount
        }
    }
})



export const { increaseCount, setOrderCount, setUserCount, setPartnerCount } = counterSlice.actions;
export default counterSlice.reducer;