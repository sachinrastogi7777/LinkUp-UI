import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {
            return state.filter(user => user._id !== action.payload);
        },
        addUserInFeed: (state, action) => {
            if (!state) return [action.payload];
            return [...state, action.payload];
        },
        removeFeed: () => {
            return null
        }
    }
});

export const { addFeed, removeUserFromFeed, addUserInFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;