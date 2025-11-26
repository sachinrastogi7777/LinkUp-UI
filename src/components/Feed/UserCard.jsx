import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { removeUserFromFeed } from '../../utils/slice/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateSentRequest } from '../../utils/slice/sentRequestSlice';
import { calculateAge } from '../../utils/helper';
import { MapPin, Lock } from 'lucide-react';
import ProfileModal from '../Profile/ProfileModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserCard = ({ user, isPremium = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);
    const isLoggedIn = !!userData;

    const { firstName, lastName, dateOfBirth, gender, about, profileImage, location } = user;
    const age = calculateAge(dateOfBirth);

    const [startPos, setStartPos] = useState(0);
    const [endPos, setEndPos] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [wasClick, setWasClick] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = async (status, userId) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

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
            if (error.response?.status === 401) {
                toast.error('Please login to perform this action', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                navigate('/login');
            }
        }
    }

    // Touch events for mobile
    const handleTouchStart = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            return;
        }
        setStartPos(e.targetTouches[0].clientX);
        setIsDragging(true);
        setWasClick(true);
    };

    const handleTouchMove = (e) => {
        if (!isLoggedIn || !isDragging) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = currentTouch - startPos;
        if (Math.abs(diff) > 5) {
            setWasClick(false);
        }
        setDragOffset(diff);
        setEndPos(currentTouch);
    };

    const handleTouchEnd = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!isDragging) return;
        setIsDragging(false);

        if (wasClick && Math.abs(dragOffset) < 5) {
            setIsModalOpen(true);
            setDragOffset(0);
            setStartPos(0);
            setEndPos(0);
            return;
        }

        const swipeDistance = startPos - endPos;
        const minSwipeDistance = 100;

        if (swipeDistance > minSwipeDistance) {
            handleClick('ignored', user._id);
        } else if (swipeDistance < -minSwipeDistance) {
            handleClick('interested', user._id);
        }

        setDragOffset(0);
        setStartPos(0);
        setEndPos(0);
    };

    // Mouse events for desktop
    const handleMouseDown = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            return;
        }
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        setStartPos(e.clientX);
        setIsDragging(true);
        setWasClick(true);
    };

    const handleMouseMove = (e) => {
        if (!isLoggedIn || !isDragging) return;
        const currentPos = e.clientX;
        const diff = currentPos - startPos;
        if (Math.abs(diff) > 5) {
            setWasClick(false);
        }
        setDragOffset(diff);
        setEndPos(currentPos);
    };

    const handleMouseUp = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!isDragging) return;
        setIsDragging(false);

        if (wasClick && Math.abs(dragOffset) < 5) {
            setIsModalOpen(true);
            setDragOffset(0);
            setStartPos(0);
            setEndPos(0);
            return;
        }

        const swipeDistance = startPos - endPos;
        const minSwipeDistance = 100;

        if (swipeDistance > minSwipeDistance) {
            handleClick('ignored', user._id);
        } else if (swipeDistance < -minSwipeDistance) {
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
        if (isDragging && isLoggedIn) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, startPos, endPos, isLoggedIn]);

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
        <>
            <div className="relative group">
                <div
                    className={`card bg-gradient-to-br from-gray-800 to-gray-900 w-72 shadow-2xl overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 border border-gray-700/50 select-none ${isLoggedIn ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                        } ${!isLoggedIn ? 'relative' : ''}`}
                    style={getSwipeStyle()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                        if (!isLoggedIn) {
                            toast.info('Please login to interact with users', {
                                position: 'top-center',
                                autoClose: 2000,
                            });
                            navigate('/login');
                        }
                    }}
                >
                    {!isLoggedIn && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 group-hover:backdrop-blur-[2px]">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-2xl">
                                <Lock className="w-5 h-5" />
                                Login to Interact
                            </div>
                        </div>
                    )}
                    {isLoggedIn && isDragging && dragOffset < 0 && (
                        <div
                            className="absolute inset-0 bg-indigo-500 z-10 flex items-center justify-center"
                            style={{ opacity: getOverlayOpacity() }}
                        >
                            <div className="text-white text-4xl font-bold transform rotate-12">
                                IGNORE
                            </div>
                        </div>
                    )}
                    {isLoggedIn && isDragging && dragOffset > 0 && (
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
                        {isLoggedIn && (
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
                        )}
                        {!isLoggedIn && (
                            <div className="card-actions justify-center gap-2 mt-2">
                                <button
                                    className="btn btn-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                                    onClick={() => navigate('/login')}
                                >
                                    <Lock className="w-4 h-4 mr-1" />
                                    Login to Connect
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-4 text-xs text-gray-600">
                        <span>← Drag/Swipe left to ignore</span>
                        <span>Drag/Swipe right to like →</span>
                    </div>
                )}
            </div>
            {isLoggedIn && (
                <ProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                    isPremium={isPremium}
                    onAction={handleClick}
                    clickFrom='Feed'
                />
            )}
        </>
    )
}

export default UserCard;