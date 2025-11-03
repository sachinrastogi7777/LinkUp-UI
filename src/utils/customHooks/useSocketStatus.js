import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSocketConnection, disconnectSocket } from '../socket';
import { updateConnectionStatus, updateUnreadCount, setUnreadCounts } from '../slice/connectionSlice';

const useSocketStatus = (isAuthenticated) => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const socketRef = useRef(null);
    const isOnlineEmitted = useRef(false);
    const listenersAttached = useRef(false);

    useEffect(() => {
        if (!isAuthenticated || !userId) {
            if (socketRef.current && isOnlineEmitted.current) {
                socketRef.current.emit('user-offline', { userId: user?._id });
                socketRef.current.off('user-status-changed');
                socketRef.current.off('message-delivered');
                socketRef.current.off('unread-counts');
                socketRef.current.off('unread-count-update');
                disconnectSocket();
                socketRef.current = null;
                isOnlineEmitted.current = false;
                listenersAttached.current = false;
            }
            return;
        }

        const socket = createSocketConnection();
        socketRef.current = socket;

        const handleConnect = () => {
            if (userId && !isOnlineEmitted.current) {
                socket.emit('user-online', { userId });
                isOnlineEmitted.current = true;
            }
        };

        const handleDisconnect = (reason) => {
            isOnlineEmitted.current = false;
        };

        const handleReconnect = () => {
            if (userId) {
                socket.emit('user-online', { userId });
                isOnlineEmitted.current = true;
            }
        };

        const handleStatusChange = ({ userId: changedUserId, isOnline, lastSeen }) => {
            dispatch(updateConnectionStatus({
                userId: changedUserId,
                isOnline,
                lastSeen
            }));
        };

        const handleMessageDelivered = ({ messageId, deliveredAt }) => {
            window.dispatchEvent(new CustomEvent('message-delivered', {
                detail: { messageId, deliveredAt }
            }));
        };

        const handleUnreadCounts = ({ unreadCounts }) => {
            dispatch(setUnreadCounts(unreadCounts));
        };

        const handleUnreadCountUpdate = ({ partnerId, unreadCount }) => {
            dispatch(updateUnreadCount({ userId: partnerId, unreadCount }));
        };

        if (!listenersAttached.current) {
            if (socket.connected && userId && !isOnlineEmitted.current) {
                socket.emit('user-online', { userId });
                isOnlineEmitted.current = true;
            }

            socket.on('connect', handleConnect);
            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', handleReconnect);
            socket.on('user-status-changed', handleStatusChange);
            socket.on('message-delivered', handleMessageDelivered);
            socket.on('unread-counts', handleUnreadCounts);
            socket.on('unread-count-update', handleUnreadCountUpdate);

            listenersAttached.current = true;
        }

        return () => {
            if (socket) {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
                socket.off('reconnect', handleReconnect);
                socket.off('user-status-changed', handleStatusChange);
                socket.off('message-delivered', handleMessageDelivered);
                socket.off('unread-counts', handleUnreadCounts);
                socket.off('unread-count-update', handleUnreadCountUpdate);
                listenersAttached.current = false;
            }
        };
    }, [isAuthenticated, userId, dispatch]);

    return socketRef.current;
};

export default useSocketStatus;