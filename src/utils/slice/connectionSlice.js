import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: [],
    reducers: {
        addConnection: (state, action) => {
            const connections = action.payload.map(connection => ({
                ...connection,
                unreadCount: connection.unreadCount ?? 0
            }))
            return connections;
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
        },

        // Set all unread counts at once (when user comes online)
        setUnreadCounts: (state, action) => {
            if (!state || state.length === 0) return state;
            const unreadCounts = action.payload;
            return state.map((connection) => {
                const userId = connection.user._id;
                const count = unreadCounts[userId] || 0;
                return {
                    ...connection,
                    unreadCount: count
                };
            });
        },

        // Update unread count for a specific user
        updateUnreadCount: (state, action) => {
            if (!state || state.length === 0) return state;
            const { userId, unreadCount } = action.payload;
            return state.map((connection) => {
                if (connection.user._id === userId) {
                    return {
                        ...connection,
                        unreadCount
                    };
                }
                return connection;
            });
        },

        // Reset unread count for a specific user (when chat is opened)
        resetUnreadCount: (state, action) => {
            if (!state || state.length === 0) return state;
            const { userId } = action.payload;
            const newState = state.map((connection) => {
                if (connection.user._id === userId) {
                    return {
                        ...connection,
                        unreadCount: 0
                    };
                }
                return connection;
            });
            return newState;
        }
    }
})

export const {
    addConnection,
    removeConnection,
    updateConnectionStatus,
    setUnreadCounts,
    updateUnreadCount,
    resetUnreadCount
} = connectionSlice.actions;

export default connectionSlice.reducer;