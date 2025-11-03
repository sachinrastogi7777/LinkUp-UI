import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Search, Check, CheckCheck, Image, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setChats } from '../../utils/slice/chatSlice';
import { Link } from 'react-router-dom';

const ChatListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatsList = useSelector((store) => store?.chats?.chats || []);
    const userData = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const fetchChatsList = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsLoading(true);
            }
            const response = await axios.get(`${BASE_URL}/chats`, { withCredentials: true });
            if (response?.data?.chats) {
                dispatch(setChats(response.data.chats));
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            if (showLoader) {
                setIsLoading(false);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        fetchChatsList(true);
    }, [fetchChatsList]);

    const getTimeDisplay = (timestamp) => {
        if (!timestamp) return '';

        try {
            const messageDate = new Date(timestamp);
            if (isNaN(messageDate.getTime())) {
                return '';
            }
            const now = new Date();
            const diffInHours = (now - messageDate) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else if (diffInHours < 168) {
                return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
            } else {
                return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const getMessagePreview = (message, isCurrentUser) => {
        if (message.messageType === 'image') {
            return (
                <span className="flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" />
                    Photo
                </span>
            );
        }

        const prefix = isCurrentUser ? 'You: ' : '';
        return prefix + message.text;
    };

    const MessageStatusIcon = ({ status }) => {
        if (status === 'seen') {
            return <CheckCheck className="w-4 h-4 text-blue-500" />;
        } else if (status === 'delivered') {
            return <CheckCheck className="w-4 h-4 text-gray-400" />;
        } else {
            return <Check className="w-4 h-4 text-gray-400" />;
        }
    };

    const filteredChats = chatsList
        .filter(chat => {
            if (!chat.lastMessage || !chat.lastMessage.createdAt) {
                return false;
            }

            const participant = chat.participants[0];
            if (!participant) return false;

            const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const timeA = new Date(a.lastMessage.createdAt).getTime();
            const timeB = new Date(b.lastMessage.createdAt).getTime();
            return timeB - timeA;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white sticky top-0 z-10 shadow-lg">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Chats</h1>
                        </div>
                        <div className="text-xs sm:text-sm bg-opacity-20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm">
                            {filteredChats.length} conversations
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 rounded-full bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-0 sm:px-4 md:px-6 py-2 sm:py-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 animate-spin mb-4" />
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Loading your chats...</p>
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                        <MessageCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-2">
                            {searchQuery ? 'No chats found' : 'No chats yet'}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400">
                            {searchQuery ? 'Try searching for a different name' : 'Start a conversation with your connections'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0 sm:space-y-1">
                        {filteredChats.map((chat) => {
                            const participant = chat.participants[0];
                            if (!participant || !chat.lastMessage) return null;

                            const isCurrentUserSender = chat.lastMessage.senderId?._id === userData._id;
                            const isUnread = chat.unreadCount > 0;

                            return (
                                <Link
                                    to={`/chat/${participant._id}`}
                                    state={{ user: participant }}
                                    key={chat.chatId}
                                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white hover:bg-opacity-60 transition-all duration-200 cursor-pointer border-b border-gray-100 sm:rounded-xl ${isUnread ? 'bg-purple-50 bg-opacity-80' : 'bg-white bg-opacity-40'
                                        }`}
                                >
                                    {/* Profile Image with Online Status */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={participant.profileImage}
                                            alt={`${participant.firstName} ${participant.lastName}`}
                                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                        {/* Online/Offline Indicator */}
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                            }`} />
                                    </div>

                                    {/* Chat Info - Middle Section */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-sm sm:text-base md:text-lg truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'
                                                }`}>
                                                {participant.firstName} {participant.lastName}
                                            </h3>
                                            {participant.isOnline && (
                                                <span className="text-xs text-green-600 font-medium">Online</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {isCurrentUserSender && (
                                                <MessageStatusIcon status={chat.lastMessage.status} />
                                            )}
                                            <p className={`text-xs sm:text-sm truncate ${isUnread ? 'text-gray-900 font-semibold' : 'text-gray-600'
                                                }`}>
                                                {getMessagePreview(chat.lastMessage, isCurrentUserSender)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side - Time and Unread Count */}
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className={`text-xs sm:text-sm ${isUnread ? 'text-purple-600 font-semibold' : 'text-gray-500'
                                            }`}>
                                            {getTimeDisplay(chat.lastMessage.createdAt)}
                                        </span>
                                        {isUnread && (
                                            <div className="min-w-[20px] h-5 sm:min-w-[24px] sm:h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg px-1.5">
                                                {chat.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;