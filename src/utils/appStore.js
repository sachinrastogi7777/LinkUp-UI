import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slice/userSlice';
import connectionReducer from './slice/connectionSlice';
import requestReducer from './slice/requestSlice';
import sentRequestReducer from './slice/sentRequestSlice';
import feedReducer from './slice/feedSlice';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('requestState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.log("Error loading state:", error);
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify({
            request: state.request,
            sentRequest: state.sentRequest
        });
        localStorage.setItem('requestState', serializedState);
    } catch (error) {
        console.log("Error saving state:", error);
    }
}

const preloadedState = loadState();

const appStore = configureStore({
    reducer: {
        user: userReducer,
        connection: connectionReducer,
        request: requestReducer,
        sentRequest: sentRequestReducer,
        feed: feedReducer
    },
    preloadedState
});

appStore.subscribe(() => {
    saveState(appStore.getState());
})

export default appStore;