import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Cake, Calendar, Loader2, Lock, MapPin, Users, X } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { formattedDate, getTimeAgo } from '../../utils/helper';
import ConnectionShimmer from '../Shimmer/ConnectionShimmer';

const ProfileModal = ({ isOpen, onClose, user, isPremium, onAction, clickFrom, requestId }) => {
    const [connectionList, setConnectionList] = useState([]);
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const { firstName, lastName, dateOfBirth, gender, about, profileImage, userName, interests, location, createdAt, coverImage, _id } = user;

    const userConnections = async (targetUserId) => {
        if (!targetUserId) return;
        try {
            setIsLoadingConnections(true);
            const connectionList = await axios.get(`${BASE_URL}/user/connections/${targetUserId}`, { withCredentials: true });
            setConnectionList(connectionList.data.userConnection);
        } catch (error) {
            console.error("Error fetching connections:", error);
        } finally {
            setIsLoadingConnections(false);
        }
    }

    useEffect(() => {
        if (isOpen && _id) {
            userConnections(_id);
        }
    }, [isOpen, _id]);

    if (!isOpen) return null;

    const formatedDOB = formattedDate(dateOfBirth);
    const joinDate = formattedDate(createdAt);

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-6 right-6 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={onClose}
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="overflow-y-auto max-h-[90vh]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                        {coverImage && (
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="relative px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 md:-mt-20">
                            <div className="relative">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-6 border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full animate-pulse"></div>
                            </div>

                            <div className="flex-1 text-center md:text-left md:ml-6 mt-4 md:mt-0">
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    {`${firstName} ${lastName}`}
                                </h1>
                                <p className="text-md mb-1.5">
                                    <span className="text-gray-400">@</span>
                                    <span className="text-gray-800 font-medium">{userName}</span>
                                </p>
                                <div className='text-gray-700 font-medium min-h-20'>
                                    {(gender || dateOfBirth) && (
                                        <span className='flex gap-2'>
                                            <p className='leading-relaxed whitespace-pre-line max-w-lg mt-2 mb-1'>{`${gender},`}</p>
                                            <p className="flex items-center gap-1 mt-2 mb-1">
                                                <Cake className='w-4 h-4' />
                                                {formatedDOB}
                                            </p>
                                        </span>
                                    )}
                                    {about && (
                                        <p className="leading-relaxed whitespace-pre-line max-w-lg mt-1 mb-2">
                                            {about}
                                        </p>
                                    )}
                                </div>
                                <div className='mt-2 min-h-10'>
                                    {interests && interests.length > 0 && (
                                        <ul className="flex flex-row flex-wrap gap-3">
                                            {interests.map((interest, index) => (
                                                <li
                                                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium"
                                                    key={index}
                                                >
                                                    {interest}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-6">
                            {isPremium && (
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    {`Connections (${connectionList?.length || 0})`}
                                    {isLoadingConnections && (
                                        <Loader2 className="w-4 h-4 animate-spin text-purple-600 ml-2" />
                                    )}
                                </h3>
                            )}

                            {isPremium ? (
                                isLoadingConnections ? (
                                    <ConnectionShimmer />
                                ) : connectionList && connectionList.length > 0 ? (
                                    <div className="space-y-3">
                                        {connectionList.map((connection, index) => {
                                            const calculateTimeDiff = getTimeAgo(connection.connectedAt);
                                            return (
                                                <div
                                                    key={connection.connectionId}
                                                    className="flex justify-between items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:translate-x-2 opacity-0 animate-fadeInUp"
                                                    style={{
                                                        animation: `fadeInUp 0.5s ease-out forwards`,
                                                        animationDelay: `${index * 0.1}s`
                                                    }}
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <div className="relative">
                                                            <img
                                                                src={connection.user.profileImage}
                                                                alt='Profile Pic'
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-700">{`${connection.user.firstName} ${connection.user.lastName}`}</span>
                                                            <span className="text-sm text-gray-500">{`@${connection.user.userName}`}</span>
                                                        </div>
                                                    </div>
                                                    <div className='text-sm text-gray-500'>{`Connected Since ${calculateTimeDiff}`}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">User don't have any connections.</p>
                                    </div>
                                )
                            ) : (
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-8 text-center">
                                    <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Unlock Connections</h3>
                                        <p className="text-gray-600 mb-6">Upgrade to Premium to see who's connected with this user</p>
                                        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">Get Premium for $5/month</button>
                                        <p className="text-xs text-gray-500 mt-4">✨ Unlock exclusive features and connections</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-gray-100">
                            {location && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {location}
                                </div>
                            )}
                            {createdAt && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    Joined {joinDate}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6">
                            {clickFrom === 'Feed' ? (
                                <>
                                    <button
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl"
                                        onClick={() => {
                                            onAction('ignored', user._id);
                                            onClose();
                                        }}
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl"
                                        onClick={() => {
                                            onAction('interested', user._id);
                                            onClose();
                                        }}
                                    >
                                        Interested
                                    </button>
                                </>
                            ) : clickFrom === 'Requests' ? (
                                <>
                                    <button
                                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-600 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl cursor-pointer"
                                        onClick={() => {
                                            onAction('accepted', requestId);
                                            onClose();
                                        }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold shadow-lg transition-all hover:shadow-xl cursor-pointer"
                                        onClick={() => {
                                            onAction('rejected', requestId);
                                            onClose();
                                        }}
                                    >
                                        Decline
                                    </button>
                                </>
                            ) : ''}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ProfileModal;