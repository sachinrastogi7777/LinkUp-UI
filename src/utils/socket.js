import io from 'socket.io-client';
import { BASE_URL } from './constants';

let socketInstance = null;

export const createSocketConnection = () => {
    if (!socketInstance) {
        if (location.hostname === 'localhost') {
            socketInstance = io(BASE_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });
        } else {
            socketInstance = io("/", {
                path: '/api/socket.io',
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });
        }
    }
    return socketInstance;
};

export const getSocketInstance = () => {
    if (!socketInstance) {
        return createSocketConnection();
    }
    return socketInstance;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};