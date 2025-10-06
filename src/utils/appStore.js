import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slice/userSlice';
import connectionReducer from './slice/connectionSlice';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        connection: connectionReducer
    }
});

export default appStore;