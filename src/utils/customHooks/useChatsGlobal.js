import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { setChats } from '../slice/chatSlice';
import { getSocketInstance } from '../socket';

const useChatsGlobal = () => {
    const dispatch = useDispatch();
    const userData = useSelector((store) => store.user);
    const listenersSetRef = useRef(false);
    const handlersRef = useRef({});

    const fetchChatsList = useCallback(async () => {
        if (!userData?._id) return;

        try {
            const response = await axios.get(`${BASE_URL}/chats`, { withCredentials: true });
            if (response?.data?.chats) {
                dispatch(setChats(response.data.chats));
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    }, [dispatch, userData?._id]);

    useEffect(() => {
        if (!userData?._id) return;

        fetchChatsList();

        const socket = getSocketInstance();
        if (!socket) {
            console.error('❌ Socket instance not found in useChatsGlobal!');
            return;
        }

        if (!listenersSetRef.current) {
            const handleChatListUpdate = () => {
                fetchChatsList();
            };

            const handleUnreadCountUpdate = () => {
                fetchChatsList();
            };

            const handleMessageDelivered = () => {
                fetchChatsList();
            };

            const handleMessagesSeen = () => {
                fetchChatsList();
            };

            const handleUserStatusChanged = () => {
                fetchChatsList();
            };

            handlersRef.current = {
                handleChatListUpdate,
                handleUnreadCountUpdate,
                handleMessageDelivered,
                handleMessagesSeen,
                handleUserStatusChanged
            };

            socket.on('chat-list-update', handleChatListUpdate);
            socket.on('unread-count-update', handleUnreadCountUpdate);
            socket.on('message-delivered', handleMessageDelivered);
            socket.on('messages-seen', handleMessagesSeen);
            socket.on('user-status-changed', handleUserStatusChanged);

            listenersSetRef.current = true;
        }

        return () => {
            if (listenersSetRef.current && handlersRef.current) {
                const socket = getSocketInstance();
                if (socket) {
                    socket.off('chat-list-update', handlersRef.current.handleChatListUpdate);
                    socket.off('unread-count-update', handlersRef.current.handleUnreadCountUpdate);
                    socket.off('message-delivered', handlersRef.current.handleMessageDelivered);
                    socket.off('messages-seen', handlersRef.current.handleMessagesSeen);
                    socket.off('user-status-changed', handlersRef.current.handleUserStatusChanged);
                }
                listenersSetRef.current = false;
                handlersRef.current = {};
            }
        };
    }, [userData?._id, fetchChatsList]);
};

export default useChatsGlobal;