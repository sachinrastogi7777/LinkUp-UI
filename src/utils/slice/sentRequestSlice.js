import { createSlice } from "@reduxjs/toolkit";

const sentRequestSlice = createSlice({
    name: 'sentRequest',
    initialState: null,
    reducers: {
        addSentRequests: (state, action) => {
            return action.payload;
        },
        updateSentRequest: (state, action) => {
            if (!state) return [action.payload];
            return [...state, action.payload];
        },
        removeSentRequest: () => {
            return null;
        }
    }
});

export const { addSentRequests, updateSentRequest, removeSentRequest } = sentRequestSlice.actions;

export default sentRequestSlice.reducer;