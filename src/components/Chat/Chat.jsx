import React, { useEffect, useRef, useState } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, Search, Image as ImageIcon, ArrowLeft, Loader2, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { createSocketConnection } from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { toast } from 'react-toastify';
import { getLastSeen, groupMessagesByDate, uploadImageToServer } from '../../utils/helper';
import MessageStatus from './MessageStatus';
import TypingIndicator from './TypingIndicator';
import { resetUnreadCount } from '../../utils/slice/connectionSlice';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalMessages, setTotalMessages] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);

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
    const socketRef = useRef(null);
    const isTypingEmittedRef = useRef(false);
    const imageInputRef = useRef(null);
    const hasJoinedChatRef = useRef(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                messageType: msg.messageType || 'text',
                imageUrl: msg.imageUrl || null,
                createdAt: msg.createdAt,
                status: msg.status || 'sent',
                deliveredAt: msg.deliveredAt,
                seenAt: msg.seenAt
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
            socketRef.current = socket;

            const joinChatRoom = () => {
                if (socket.connected && !hasJoinedChatRef.current) {
                    socket.emit('joinChat', { loggedInUserId, userId });
                    hasJoinedChatRef.current = true;

                    dispatch(resetUnreadCount({ userId }));
                }
            };

            if (socket.connected) {
                joinChatRoom();
            }

            socket.on('connect', joinChatRoom);

            // RECEIVE MESSAGE
            socket.on('receiveMessage', (data) => {
                const newMessageObj = {
                    senderId: data.senderId,
                    senderName: data.senderName,
                    receiverId: data.receiverId,
                    receiverName: data.receiverName,
                    text: data.text,
                    messageType: data.messageType || 'text',
                    imageUrl: data.imageUrl || null,
                    createdAt: data.createdAt,
                    timeStamp: data.timeStamp,
                    messageId: data.messageId,
                    status: data.status,
                    deliveredAt: data.deliveredAt,
                    seenAt: data.seenAt
                };

                setMessages((prevMessages) => {
                    const existingIndex = prevMessages.findIndex(msg => msg.messageId === data.messageId);
                    if (existingIndex !== -1) {
                        return prevMessages.map((msg, idx) =>
                            idx === existingIndex ? { ...msg, ...newMessageObj } : msg
                        );
                    }
                    return [...prevMessages, newMessageObj];
                });

                if (data.senderId !== loggedInUserId) {
                    setTotalMessages(prev => prev + 1);
                    setIsPartnerTyping(false);
                }

                setTimeout(() => scrollToBottom(), 100);
            });

            // MESSAGE DELIVERED
            socket.on('message-delivered', ({ messageId, deliveredAt }) => {
                setMessages(prevMessages =>
                    prevMessages.map(msg => {
                        if (msg.messageId === messageId && msg.status === 'sent') {
                            return { ...msg, status: 'delivered', deliveredAt };
                        }
                        return msg;
                    })
                );
            });

            // MESSAGES SEEN (multiple)
            socket.on('messages-seen', ({ messageIds, seenAt }) => {
                setMessages(prevMessages =>
                    prevMessages.map(msg => {
                        if (messageIds && messageIds.includes(msg.messageId) && msg.status !== 'seen') {
                            return { ...msg, status: 'seen', seenAt };
                        }
                        return msg;
                    })
                );
            });

            // USER STATUS CHANGED
            socket.on('user-status-changed', ({ userId: changedUserId, isOnline, lastSeen }) => {
                if (changedUserId === userId) {
                    setChatPartner(prev => ({
                        ...prev,
                        isOnline,
                        lastSeen
                    }));
                }
            });

            // USER TYPING
            socket.on('user-typing', ({ userId: typingUserId, userName, isTyping }) => {
                if (typingUserId === userId) {
                    setIsPartnerTyping(isTyping);
                }
            });

            // Cleanup function
            return () => {
                if (socket && loggedInUserId && userId && hasJoinedChatRef.current) {
                    if (isTypingEmittedRef.current) {
                        socket.emit('stop-typing', {
                            senderId: loggedInUserId,
                            receiverId: userId
                        });
                        isTypingEmittedRef.current = false;
                    }
                    socket.emit('leaveChat', { loggedInUserId, userId });
                    hasJoinedChatRef.current = false;
                }

                if (socket) {
                    socket.off('receiveMessage');
                    socket.off('message-delivered');
                    socket.off('messages-seen');
                    socket.off('user-status-changed');
                    socket.off('user-typing');
                    socket.off('connect');
                }

                socketRef.current = null;
            };
        };

        initializeChat();
    }, [loggedInUserId, userId, navigate, dispatch]);

    // Component unmount
    useEffect(() => {
        return () => {
            if (socketRef.current && hasJoinedChatRef.current && loggedInUserId && userId) {
                if (isTypingEmittedRef.current) {
                    socketRef.current.emit('stop-typing', {
                        senderId: loggedInUserId,
                        receiverId: userId
                    });
                }
                socketRef.current.emit('leaveChat', { loggedInUserId, userId });
                hasJoinedChatRef.current = false;
            }
        };
    }, [userId, loggedInUserId]);

    // Page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (socketRef.current?.connected && loggedInUserId && userId && hasJoinedChatRef.current) {
                if (isTypingEmittedRef.current) {
                    socketRef.current.emit('stop-typing', {
                        senderId: loggedInUserId,
                        receiverId: userId
                    });
                }
                socketRef.current.emit('leaveChat', { loggedInUserId, userId });
                hasJoinedChatRef.current = false;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [loggedInUserId, userId]);

    const handleTyping = (messageValue) => {
        if (!socketRef.current?.connected) {
            return;
        }

        const currentLength = messageValue.trim().length;
        if (currentLength === 0) {
            if (isTypingEmittedRef.current) {
                socketRef.current.emit('stop-typing', {
                    senderId: loggedInUserId,
                    receiverId: userId
                });
                isTypingEmittedRef.current = false;
            }
            return;
        }

        if (!isTypingEmittedRef.current) {
            socketRef.current.emit('typing', {
                senderId: loggedInUserId,
                receiverId: userId,
                senderName: loggedInUser?.firstName + ' ' + loggedInUser?.lastName
            });
            isTypingEmittedRef.current = true;
        }
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file.', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB.', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedImage) {
            return;
        }

        if (!socketRef.current) {
            toast.error('Connection error. Please refresh the page.');
            return;
        }

        // Stop typing when message is sent
        if (isTypingEmittedRef.current) {
            socketRef.current.emit('stop-typing', {
                senderId: loggedInUserId,
                receiverId: userId
            });
            isTypingEmittedRef.current = false;
        }

        let imageUrl = null;

        if (selectedImage) {
            try {
                setIsUploadingImage(true);
                imageUrl = await uploadImageToServer(selectedImage, 'chat');
            } catch (error) {
                console.error('Image upload failed:', error);
                toast.error('Failed to send image. Please try again.');
                setIsUploadingImage(false);
                return;
            } finally {
                setIsUploadingImage(false);
            }
        }

        socketRef.current.emit('sendMessage', {
            senderId: loggedInUserId,
            senderName: loggedInUser?.firstName + ' ' + loggedInUser?.lastName,
            receiverId: userId,
            receiverName: chatPartner?.firstName + ' ' + chatPartner?.lastName || 'User',
            text: newMessage.trim(),
            imageUrl: imageUrl,
            messageType: imageUrl ? 'image' : 'text',
            timeStamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        });

        setNewMessage('');
        handleRemoveImage();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (isPartnerTyping) {
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [isPartnerTyping]);

    useEffect(() => {
        const handleGlobalDelivery = (event) => {
            const { messageId, deliveredAt } = event.detail;

            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    if (msg.messageId === messageId && msg.status === 'sent') {
                        return { ...msg, status: 'delivered', deliveredAt };
                    }
                    return msg;
                })
            );
        };

        window.addEventListener('message-delivered', handleGlobalDelivery);

        return () => {
            window.removeEventListener('message-delivered', handleGlobalDelivery);
        };
    }, []);

    const lastSeen = getLastSeen(chatPartner?.lastSeen);
    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 md:p-4">
            {/* Mobile: Full screen | Desktop: Centered with padding */}
            <div className="md:max-w-5xl mx-auto h-screen md:h-[calc(100vh-2rem)] bg-white md:bg-opacity-95 md:backdrop-blur-xl md:rounded-3xl md:shadow-2xl overflow-hidden flex flex-col">

                {/* Header - Responsive */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        <button
                            className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 md:p-2 transition-all flex-shrink-0"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <div className="relative flex-shrink-0">
                            <img
                                src={chatPartner?.profileImage || '/default-avatar.png'}
                                alt={chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : 'Chat Partner'}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg object-cover"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-2 border-white rounded-full ${chatPartner?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                                {chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : 'Chat'}
                            </h2>
                            <p className="text-white text-xs sm:text-sm opacity-90 truncate">
                                {isPartnerTyping ? (
                                    <span className="text-green-300 font-medium">typing...</span>
                                ) : (
                                    chatPartner?.isOnline ? 'online' : lastSeen
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Header Actions - All buttons visible on mobile */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 md:p-2 transition-all">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 md:p-2 transition-all">
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 md:p-2 transition-all">
                            <Video className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button className="text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 md:p-2 transition-all">
                            <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Container - Responsive padding */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50"
                >
                    {isLoadingMore && (
                        <div className="flex justify-center py-3 md:py-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                <span className="text-xs md:text-sm">Loading more messages...</span>
                            </div>
                        </div>
                    )}
                    {!hasMore && messages.length > 0 && (
                        <div className="flex justify-center py-3 md:py-4">
                            <div className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm">
                                <span className="text-xs text-gray-500">
                                    This is the beginning of your conversation
                                </span>
                            </div>
                        </div>
                    )}

                    {Object.keys(groupedMessages).map((dateLabel) => (
                        <div key={dateLabel} className="space-y-3 md:space-y-4">
                            {/* Date Divider */}
                            <div className="flex items-center justify-center my-4 md:my-6">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <div className="px-3 md:px-4">
                                    <div className="bg-white px-3 py-1 md:px-4 md:py-1 rounded-full shadow-sm">
                                        <span className="text-xs font-semibold text-gray-600">{dateLabel}</span>
                                    </div>
                                </div>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {groupedMessages[dateLabel].map((msg) => {
                                const timeStamp = msg?.createdAt
                                    ? new Date(msg?.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                    : msg?.timeStamp;
                                const isOwnMessage = msg.senderId === loggedInUserId;

                                return (
                                    <div
                                        key={msg.messageId}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-end gap-1.5 md:gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Profile Image - Hidden on mobile for incoming messages */}
                                            {!isOwnMessage && (
                                                <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
                                                    <img
                                                        src={chatPartner?.profileImage || '/default-avatar.png'}
                                                        alt={chatPartner?.firstName}
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                                                    />
                                                    <span className="text-xs text-gray-500 hidden md:block">{chatPartner?.firstName}</span>
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-1">
                                                {/* Message Bubble */}
                                                <div
                                                    className={`px-3 py-2 md:px-4 md:py-2 rounded-2xl ${isOwnMessage
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                                                            : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                                                        }`}
                                                >
                                                    {msg.messageType === 'image' && msg.imageUrl && (
                                                        <img
                                                            src={msg.imageUrl}
                                                            alt="Shared image"
                                                            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity mb-1 md:mb-2"
                                                            style={{ maxHeight: '250px', minWidth: '150px' }}
                                                            onClick={() => setFullscreenImage(msg.imageUrl)}
                                                        />
                                                    )}
                                                    {msg.text && (
                                                        <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.text}</p>
                                                    )}
                                                </div>

                                                {/* Timestamp & Status */}
                                                <div className={`flex items-center gap-1.5 text-xs text-gray-500 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <span className="text-xs">{timeStamp}</span>
                                                    {isOwnMessage && (
                                                        <MessageStatus status={msg.status} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {isPartnerTyping && (
                        <TypingIndicator
                            userName={chatPartner?.firstName}
                            userImage={chatPartner?.profileImage}
                        />
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Responsive */}
                <div className="bg-white border-t border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mb-2 md:mb-4 relative inline-block">
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="rounded-lg max-h-24 md:max-h-32 object-cover shadow-lg"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                        {/* Emoji Picker */}
                        <div style={{ position: 'relative' }} ref={emojiPickerRef} className="flex-shrink-0">
                            <button
                                className="text-gray-500 hover:text-purple-600 transition-colors p-1.5 md:p-2 hover:bg-purple-50 rounded-full"
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                            >
                                <Smile className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            {showEmojiPicker && (
                                <div style={{
                                    position: 'absolute',
                                    zIndex: 100,
                                    bottom: '50px',
                                    left: 0
                                }} className="scale-90 sm:scale-100 origin-bottom-left">
                                    <EmojiPicker
                                        onEmojiClick={(emojiData) => {
                                            const emoji = emojiData.emoji || emojiData.native || emojiData;
                                            setNewMessage((prev) => prev + emoji);
                                        }}
                                        width={280}
                                        height={350}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Paperclip - Now visible on all devices */}
                        <div className="relative group flex-shrink-0">
                            <button className="text-gray-500 hover:text-purple-600 transition-colors p-1.5 md:p-2 hover:bg-purple-50 rounded-full">
                                <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Under development
                            </span>
                        </div>

                        {/* Image Upload */}
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                        <button
                            onClick={() => imageInputRef.current?.click()}
                            className="text-gray-500 hover:text-purple-600 transition-colors p-1.5 md:p-2 hover:bg-purple-50 rounded-full flex-shrink-0"
                        >
                            <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Text Input - Responsive */}
                        <div className="flex-1 relative min-w-0">
                            <textarea
                                value={newMessage}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewMessage(value);
                                    handleTyping(value);
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                rows="1"
                                className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none resize-none bg-gray-50 text-gray-800 placeholder-gray-400 text-sm md:text-base"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            className="p-2 md:p-3 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex-shrink-0"
                            disabled={(!newMessage.trim() && !selectedImage) || isUploadingImage}
                            onClick={handleSendMessage}
                        >
                            {isUploadingImage ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Help Text - Hidden on mobile */}
                    <p className="text-xs text-gray-400 mt-2 text-center hidden sm:block">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setFullscreenImage(null)}
                >
                    <button
                        onClick={() => setFullscreenImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <img
                        src={fullscreenImage}
                        alt="Fullscreen"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default Chat;