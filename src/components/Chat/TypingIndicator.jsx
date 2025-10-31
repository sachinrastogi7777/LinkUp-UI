import React from "react";

const TypingIndicator = ({ userName, userImage }) => {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl rounded-bl-none shadow-md max-w-md">
            <div className="relative">
                <img
                    src={userImage || '/default-avatar.png'}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <span className="absolute inset-0 rounded-full bg-purple-400 opacity-75 animate-ping"></span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">
                    {userName} is typing
                </span>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;