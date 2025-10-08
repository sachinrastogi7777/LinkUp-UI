import React, { useEffect } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { removeUserFromFeed } from '../../utils/slice/feedSlice';
import { useDispatch } from 'react-redux';
import { updateSentRequest } from '../../utils/slice/sentRequestSlice';
import { calculateAge } from '../../utils/helper';
import { MapPin } from 'lucide-react';

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    const { firstName, lastName, dateOfBirth, gender, about, profileImage, location } = user;
    const age = calculateAge(dateOfBirth);

    const [startPos, setStartPos] = React.useState(0);
    const [endPos, setEndPos] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(0);

    const handleClick = async (status, userId) => {
        const { _id, firstName, lastName, userName, interests, about, profileImage, location, createdAt, updatedAt, dateOfBirth, gender, coverImage } = user;
        const filteredUserData = { _id, firstName, lastName, userName, interests, about, profileImage, location, createdAt, updatedAt, dateOfBirth, gender, coverImage };
        try {
            const response = await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true });
            if (response.status === 200 && status === 'interested') {
                const originalResponse = response.data.data;
                const modifiedPayload = { ...originalResponse, toUserId: filteredUserData };
                dispatch(removeUserFromFeed(userId));
                dispatch(updateSentRequest(modifiedPayload));
            }
            else if (response.status === 200 && status === 'ignored') {
                dispatch(removeUserFromFeed(userId));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Touch events for mobile
    const handleTouchStart = (e) => {
        setStartPos(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = currentTouch - startPos;
        setDragOffset(diff);
        setEndPos(currentTouch);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const swipeDistance = startPos - endPos;
        const minSwipeDistance = 100;

        if (swipeDistance > minSwipeDistance) {
            // Left swipe - Ignore
            handleClick('ignored', user._id);
        } else if (swipeDistance < -minSwipeDistance) {
            // Right swipe - Interested
            handleClick('interested', user._id);
        }

        setDragOffset(0);
        setStartPos(0);
        setEndPos(0);
    };

    // Mouse events for desktop
    const handleMouseDown = (e) => {
        e.preventDefault();
        setStartPos(e.clientX);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentPos = e.clientX;
        const diff = currentPos - startPos;
        setDragOffset(diff);
        setEndPos(currentPos);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const swipeDistance = startPos - endPos;
        const minSwipeDistance = 100;

        if (swipeDistance > minSwipeDistance) {
            // Left swipe - Ignore
            handleClick('ignored', user._id);
        } else if (swipeDistance < -minSwipeDistance) {
            // Right swipe - Interested
            handleClick('interested', user._id);
        }

        setDragOffset(0);
        setStartPos(0);
        setEndPos(0);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setDragOffset(0);
            setStartPos(0);
            setEndPos(0);
        }
    };

    // Add global mouse up listener
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, startPos, endPos]);

    const getSwipeStyle = () => {
        if (!isDragging || dragOffset === 0) return {};

        const rotation = dragOffset * 0.05;
        return {
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            transition: 'none'
        };
    };

    const getOverlayOpacity = () => {
        if (!isDragging || dragOffset === 0) return 0;
        return Math.min(Math.abs(dragOffset) / 150, 0.8);
    };

    return (
        <div className="relative group">
            <div
                className="card bg-gradient-to-br from-gray-800 to-gray-900 w-72 shadow-2xl overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 border border-gray-700/50 cursor-grab active:cursor-grabbing select-none"
                style={getSwipeStyle()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
            >
                {/* Swipe Indicators */}
                {isDragging && dragOffset < 0 && (
                    <div
                        className="absolute inset-0 bg-indigo-500 z-10 flex items-center justify-center"
                        style={{ opacity: getOverlayOpacity() }}
                    >
                        <div className="text-white text-4xl font-bold transform rotate-12">
                            IGNORE
                        </div>
                    </div>
                )}
                {isDragging && dragOffset > 0 && (
                    <div
                        className="absolute inset-0 bg-pink-500 z-10 flex items-center justify-center"
                        style={{ opacity: getOverlayOpacity() }}
                    >
                        <div className="text-white text-4xl font-bold transform -rotate-12">
                            INTERESTED
                        </div>
                    </div>
                )}

                <figure className="h-64 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    <img
                        src={profileImage}
                        alt="User Profile Pic"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                </figure>
                <div className="card-body p-5 bg-gray-900/95 backdrop-blur-sm text-white relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>

                    <h2 className="card-title text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                        {firstName + " " + lastName}
                    </h2>

                    <div className="min-h-16 mb-2">
                        {about && (
                            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-1">
                                {about}
                            </p>
                        )}
                        {gender && dateOfBirth && (
                            <p className="text-xs font-medium text-purple-300 flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-purple-400 rounded-full"></span>
                                {`${gender}, ${age}`}
                            </p>
                        )}
                        {location && (
                            <p className="text-xs font-medium text-purple-300 flex items-center gap-2 my-2">
                                <MapPin className='w-3 h-3' />
                                {location}
                            </p>
                        )}
                    </div>

                    <div className="card-actions justify-center gap-2 mt-2">
                        <button
                            className="btn btn-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-none px-6 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                            onClick={() => handleClick('ignored', user._id)}
                        >
                            Ignore
                        </button>
                        <button
                            className="btn btn-sm bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-none px-5 rounded-full shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-pink-500/50 hover:-translate-y-0.5"
                            onClick={() => handleClick('interested', user._id)}
                        >
                            Interested
                        </button>
                    </div>
                </div>
            </div>

            {/* Swipe Hints */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-4 text-xs text-gray-600">
                <span>← Drag/Swipe left to ignore</span>
                <span>Drag/Swipe right to like →</span>
            </div>
        </div>
    )
}

export default UserCard;
