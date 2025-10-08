import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: 'request',
    initialState: null,
    reducers: {
        addRequests: (state, action) => {
            return action.payload;
        },
        updateRequest: (state, action) => {
            return [...state, action.payload];
        },
        removeRequest: () => {
            return null;
        }
    }
});

export const { addRequests, updateRequest, removeRequest } = requestSlice.actions;

export default requestSlice.reducer;