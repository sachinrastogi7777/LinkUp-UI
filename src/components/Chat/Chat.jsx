import React, { useEffect, useRef, useState } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, Search, Image, ArrowLeft, Loader2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { createSocketConnection } from '../../utils/socket';
import { useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { toast } from 'react-toastify';
import { getLastSeen, groupMessagesByDate } from '../../utils/helper';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalMessages, setTotalMessages] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loggedInUser = useSelector(store => store.user);
    const loggedInUserId = loggedInUser?._id;
    const userId = useParams().userId;
    const location = useLocation();
    const [chatPartner, setChatPartner] = useState(location?.state?.user || null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const previousScrollHeight = useRef(0);
    const isFetchingRef = useRef(false);
    const emojiPickerRef = useRef(null);

    const navigate = useNavigate();

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const isUserConnected = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/isUserConnected/${userId}`, { withCredentials: true });
            if (response.data.message === 'You are not connected with this user.') {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking user connection:', error);
            return false;
        }
    };

    // Fetch chat messages with pagination
    const fetchChatMessages = async (page = 1, shouldScrollToBottom = true) => {
        if (isFetchingRef.current) {
            return;
        }

        try {
            isFetchingRef.current = true;

            if (page > 1) {
                setIsLoadingMore(true);
            }
            const startTime = Date.now();
            const response = await axios.get(
                `${BASE_URL}/chat/${userId}?page=${page}&limit=20`,
                { withCredentials: true }
            );
            const { messages: newMessages, pagination } = response.data;

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);
            if (remainingTime > 0 && page > 1) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            const mappedMessages = newMessages.map((msg) => ({
                senderId: msg.senderId._id,
                senderName: msg.senderId.firstName + ' ' + msg.senderId.lastName,
                messageId: msg._id,
                text: msg.text,
                createdAt: msg.createdAt
            }));

            if (page === 1) {
                setMessages(mappedMessages);
                setIsInitialLoad(false);
            } else {
                setMessages(prev => [...mappedMessages, ...prev]);
            }

            setHasMore(pagination.hasMore);
            setTotalMessages(pagination.totalMessages);
            setCurrentPage(page);

            // Scroll handling
            if (page === 1 && shouldScrollToBottom) {
                setTimeout(() => scrollToBottom(), 100);
            } else if (page > 1) {
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight;
                        const scrollDiff = newScrollHeight - previousScrollHeight.current;
                        messagesContainerRef.current.scrollTop = scrollDiff + 50;
                    }
                    setTimeout(() => {
                        isFetchingRef.current = false;
                    }, 500);
                }, 100);
            }

        } catch (error) {
            console.error('Failed to fetch chat messages:', error);
            toast.error('Failed to load messages');
            isFetchingRef.current = false;
        } finally {
            if (page > 1) {
                setIsLoadingMore(false);
            }
            if (page === 1) {
                isFetchingRef.current = false;
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle scroll event for infinite scroll
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop < 100 && hasMore && !isLoadingMore && !isFetchingRef.current) {
            previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
            fetchChatMessages(currentPage + 1, false);
        }
    };

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        let throttleTimeout = null;
        const throttledScroll = () => {
            if (throttleTimeout) return;
            throttleTimeout = setTimeout(() => {
                handleScroll();
                throttleTimeout = null;
            }, 300);
        };

        container.addEventListener('scroll', throttledScroll);

        return () => {
            container.removeEventListener('scroll', throttledScroll);
            if (throttleTimeout) {
                clearTimeout(throttleTimeout);
            }
        };
    }, [currentPage, hasMore, isLoadingMore]);

    useEffect(() => {
        const checkConnectionAndFetchChat = async () => {
            const connected = await isUserConnected();
            if (connected) {
                fetchChatMessages(1, true);
            }
        };

        checkConnectionAndFetchChat();
    }, [userId]);

    useEffect(() => {
        const initializeChat = async () => {
            if (!loggedInUserId) {
                return;
            }

            const connected = await isUserConnected();
            if (!connected) {
                toast.error('You are not connected with this user. Redirecting to profile...', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
                return;
            }

            const socket = createSocketConnection();
            socket.emit('joinChat', { loggedInUserId, userId });

            socket.on('receiveMessage', ({ senderId, senderName, receiverId, receiverName, text, timeStamp, createdAt }) => {
                const newMessageObj = {
                    senderId: senderId,
                    senderName: senderName,
                    receiverId: receiverId,
                    receiverName: receiverName,
                    text: text,
                    createdAt: createdAt,
                    timeStamp: timeStamp,
                    messageId: Date.now().toString()
                };

                setMessages((prevMessages) => [...prevMessages, newMessageObj]);
                setTotalMessages(prev => prev + 1);

                setTimeout(() => scrollToBottom(), 100);
            });

            socket.on('user-status-changed', ({ userId: changedUserId, isOnline, lastSeen }) => {
                if (changedUserId === userId) {
                    setChatPartner(prev => ({
                        ...prev,
                        isOnline,
                        lastSeen
                    }));
                }
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('user-status-changed');
                socket.disconnect();
            };
        };

        initializeChat();
    }, [loggedInUserId, userId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const socket = createSocketConnection();
        socket.emit('sendMessage', {
            senderId: loggedInUserId,
            senderName: loggedInUser?.firstName + ' ' + loggedInUser?.lastName,
            receiverId: userId,
            receiverName: chatPartner?.firstName + ' ' + chatPartner?.lastName || 'User',
            text: newMessage,
            timeStamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        });

        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const lastSeen = getLastSeen(chatPartner?.updatedAt);
    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
            <div className="max-w-5xl mx-auto h-[calc(100vh-2rem)] bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <img
                                src={chatPartner?.profileImage || '/default-avatar.png'}
                                alt={chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : 'Chat Partner'}
                                className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                            />
                            {chatPartner?.isOnline ? (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            ) : (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">
                                {chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : 'Chat'}
                            </h2>
                            <p className="text-white text-sm opacity-90">
                                {chatPartner?.isOnline ? 'online' : lastSeen}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
                >
                    {isLoadingMore && (
                        <div className="flex justify-center py-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading more messages...</span>
                            </div>
                        </div>
                    )}
                    {!hasMore && messages.length > 0 && (
                        <div className="flex justify-center py-4">
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                                <span className="text-xs text-gray-500">
                                    This is the beginning of your conversation
                                </span>
                            </div>
                        </div>
                    )}

                    {Object.keys(groupedMessages).map((dateLabel) => (
                        <div key={dateLabel} className="space-y-4">
                            <div className="flex items-center justify-center my-6">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <div className="px-4">
                                    <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                                        <span className="text-xs font-semibold text-gray-600">{dateLabel}</span>
                                    </div>
                                </div>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {groupedMessages[dateLabel].map((msg) => {
                                const timeStamp = msg?.createdAt
                                    ? new Date(msg?.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                    : msg?.timeStamp;
                                return (
                                    <div
                                        key={msg.messageId}
                                        className={`flex ${msg.senderId === loggedInUserId ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-center gap-2 max-w-[70%] ${msg.senderId === loggedInUserId ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {msg.senderId !== loggedInUserId && (
                                                <img
                                                    src={chatPartner?.profileImage || '/default-avatar.png'}
                                                    alt={chatPartner?.firstName}
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <div
                                                    className={`px-4 py-2 rounded-2xl ${msg.senderId === loggedInUserId
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                </div>
                                                <div className={`flex items-center gap-1 text-xs text-gray-500 ${msg.senderId === loggedInUserId ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <span>{timeStamp}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div style={{ position: 'relative' }} ref={emojiPickerRef}>
                            <button
                                className="text-gray-500 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-full"
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                            >
                                <Smile className="w-6 h-6" />
                            </button>
                            {showEmojiPicker && (
                                <div style={{ position: 'absolute', zIndex: 100, bottom: '50px', left: 0 }}>
                                    <EmojiPicker
                                        onEmojiClick={(emojiData) => {
                                            const emoji = emojiData.emoji || emojiData.native || emojiData;
                                            setNewMessage((prev) => prev + emoji);
                                        }}
                                        width={350}
                                        height={400}
                                    />
                                </div>
                            )}
                        </div>
                        <button className="text-gray-500 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-full">
                            <Paperclip className="w-6 h-6" />
                        </button>
                        <button className="text-gray-500 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-full">
                            <Image className="w-6 h-6" />
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                rows="1"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none resize-none bg-gray-50 text-gray-800 placeholder-gray-400"
                                style={{ maxHeight: '120px' }}
                            />
                        </div>

                        <button
                            className="p-3 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={!newMessage.trim()}
                            onClick={handleSendMessage}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chat;