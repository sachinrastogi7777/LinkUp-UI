import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        clearChats: (state) => {
            state.chats = [];
        },
    }
});

export const { setChats, clearChats } = chatSlice.actions;
export default chatSlice.reducer;