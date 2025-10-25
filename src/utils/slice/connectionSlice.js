import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: [],
    reducers: {
        addConnection: (state, action) => {
            return action.payload;
        },
        removeConnection: () => {
            return null;
        },
        updateConnectionStatus: (state, action) => {
            if (!state || state.length === 0) return state;
            const { userId, isOnline, lastSeen } = action.payload;
            return state.map((connection) => {
                if (connection.user._id === userId) {
                    return {
                        ...connection,
                        user: {
                            ...connection.user,
                            isOnline,
                            lastSeen: lastSeen || connection.user.lastSeen,
                            updatedAt: lastSeen || connection.user.updatedAt
                        }
                    };
                }
                return connection;
            });
        }
    }
})

export const { addConnection, removeConnection, updateConnectionStatus } = connectionSlice.actions;

export default connectionSlice.reducer;
