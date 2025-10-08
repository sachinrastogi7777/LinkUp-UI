import React, { useState, useEffect } from 'react';
import { Heart, Users, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../../utils/slice/feedSlice';

export default function EmptyFeedPage() {
    const dispatch = useDispatch();
    const getFeedData = useSelector((store) => store.feed);
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => (prev + 1) % 3);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRefreshFeed = () => {
        console.log("Refresh Feed Clicked");
        const fetchFeed = getFeedData.length === 0 ? null : getFeedData;
        console.log(fetchFeed);
        dispatch(addFeed(fetchFeed));
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Animated Icon Container */}
                <div className="relative mb-8 flex justify-center">
                    {/* Outer pulse rings */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${pulse === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                        <div className="w-48 h-48 rounded-full border-4 border-pink-400"></div>
                    </div>
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${pulse === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                        <div className="w-48 h-48 rounded-full border-4 border-purple-400"></div>
                    </div>
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${pulse === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                        <div className="w-48 h-48 rounded-full border-4 border-blue-400"></div>
                    </div>

                    {/* Center icon */}
                    <div className="relative z-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full p-8 shadow-2xl animate-bounce">
                        <Users className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>

                    {/* Floating hearts */}
                    <Heart
                        className="absolute top-0 left-8 w-6 h-6 text-pink-500 animate-pulse"
                        fill="currentColor"
                        style={{ animationDelay: '0ms', animationDuration: '2000ms' }}
                    />
                    <Heart
                        className="absolute top-4 right-8 w-8 h-8 text-purple-500 animate-pulse"
                        fill="currentColor"
                        style={{ animationDelay: '500ms', animationDuration: '2500ms' }}
                    />
                    <Heart
                        className="absolute bottom-4 left-12 w-5 h-5 text-blue-500 animate-pulse"
                        fill="currentColor"
                        style={{ animationDelay: '1000ms', animationDuration: '2200ms' }}
                    />
                </div>

                {/* Text Content */}
                <div className="text-center my-14 space-y-4 animate-fade-in">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        No More Users Right Now
                    </h2>
                    <p className="text-gray-600 text-lg">
                        You've seen everyone in your area! Check back soon for new profiles.
                    </p>
                </div>

                {/* Refresh Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        className="group cursor-pointer relative px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        onClick={handleRefreshFeed}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Refresh Feed
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ${pulse === i ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
                                }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}