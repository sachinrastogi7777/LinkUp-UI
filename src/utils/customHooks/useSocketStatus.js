import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSocketConnection } from '../socket';
import { updateConnectionStatus } from '../slice/connectionSlice';

const useSocketStatus = (isAuthenticated) => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const socketRef = useRef(null);
    const isOnlineEmitted = useRef(false);

    useEffect(() => {
        // If user is not authenticated, cleanup everything
        if (!isAuthenticated || !userId) {
            if (socketRef.current && isOnlineEmitted.current) {
                socketRef.current.emit('user-offline', { userId: user?._id });
                socketRef.current.off('user-status-changed');
                socketRef.current.off('message-delivered');
                socketRef.current.disconnect();
                socketRef.current = null;
                isOnlineEmitted.current = false;
            }
            return;
        }

        // Get or create socket connection (singleton)
        const socket = createSocketConnection();
        socketRef.current = socket;

        // Handler for when socket connects
        const handleConnect = () => {
            if (userId && !isOnlineEmitted.current) {
                socket.emit('user-online', { userId });
                console.log('👤 User marked as ONLINE:', userId);
                isOnlineEmitted.current = true;
            }
        };

        // Handler for when socket disconnects
        const handleDisconnect = (reason) => {
            isOnlineEmitted.current = false;
        };

        // Handler for when socket reconnects
        const handleReconnect = () => {
            if (userId) {
                socket.emit('user-online', { userId });
                console.log('👤 User marked as ONLINE after reconnect:', userId);
                isOnlineEmitted.current = true;
            }
        };

        // Handler for user status changes
        const handleStatusChange = ({ userId: changedUserId, isOnline, lastSeen }) => {
            dispatch(updateConnectionStatus({
                userId: changedUserId,
                isOnline,
                lastSeen
            }));
        };

        // Handler for message delivered (global listener)
        const handleMessageDelivered = ({ messageId, deliveredAt }) => {
            // Dispatch custom event for Chat component to listen
            window.dispatchEvent(new CustomEvent('message-delivered', {
                detail: { messageId, deliveredAt }
            }));
        };

        // If socket is already connected, emit user-online immediately
        if (socket.connected && userId && !isOnlineEmitted.current) {
            socket.emit('user-online', { userId });
            isOnlineEmitted.current = true;
        }

        // Attach event listeners
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('reconnect', handleReconnect);
        socket.on('user-status-changed', handleStatusChange);
        socket.on('message-delivered', handleMessageDelivered);

        // Cleanup function
        return () => {
            // Remove only the listeners we added
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('reconnect', handleReconnect);
            socket.off('user-status-changed', handleStatusChange);
            socket.off('message-delivered', handleMessageDelivered);
        };
    }, [isAuthenticated, userId, dispatch]);

    return socketRef.current;
};

export default useSocketStatus;