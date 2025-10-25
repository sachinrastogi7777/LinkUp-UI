import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSocketConnection } from '../socket';
import { updateConnectionStatus } from '../slice/connectionSlice';

const useSocketStatus = (isAuthenticated) => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const userId = user?._id;

    useEffect(() => {
        if (!isAuthenticated || !userId) return;

        const socket = createSocketConnection();
        socket.emit('user-online', { userId });
        socket.on('user-status-changed', ({ userId: changedUserId, isOnline, lastSeen }) => {
            dispatch(updateConnectionStatus({
                userId: changedUserId,
                isOnline,
                lastSeen
            }));
        });

        return () => {
            socket.emit('user-offline', { userId });
            socket.off('user-status-changed');
        };
    }, [isAuthenticated, userId, dispatch]);
};

export default useSocketStatus;