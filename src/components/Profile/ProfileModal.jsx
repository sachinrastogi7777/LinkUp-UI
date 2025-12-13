import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Cake, Calendar, Loader2, MapPin, Users, X } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { formattedDate } from '../../utils/helper';
import ConnectionShimmer from '../Shimmer/ConnectionShimmer';
import PremiumWarning from './PremiumWarning';
import Pagination from './Pagination';

const ProfileModal = ({ isOpen, onClose, user, isPremium, onAction, clickFrom, requestId }) => {
    const [connectionList, setConnectionList] = useState([]);
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalConnections: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 5
    });
    const { firstName, lastName, dateOfBirth, gender, about, profileImage, userName, interests, location, createdAt, coverImage, _id, isOnline } = user;

    const userConnections = async (targetUserId, page = 1) => {
        if (!targetUserId) return;
        try {
            setIsLoadingConnections(true);
            const response = await axios.get(
                `${BASE_URL}/user/connections/${targetUserId}?page=${page}&limit=5`,
                { withCredentials: true }
            );
            if (response) {
                setConnectionList(response.data.userConnection);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            }
        } catch (error) {
            console.error("Error fetching connections:", error);
        } finally {
            setIsLoadingConnections(false);
        }
    }

    useEffect(() => {
        if (isOpen && _id) {
            userConnections(_id, currentPage);
        }
    }, [isOpen, _id, currentPage]);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatedDOB = formattedDate(dateOfBirth);
    const joinDate = formattedDate(createdAt);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur p-2 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden transform transition-all duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={onClose}
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>

                <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                        {coverImage && (
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="relative px-4 sm:px-6 md:px-10 pb-6 sm:pb-8">
                        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 -mt-12 sm:-mt-16 md:-mt-20">
                            <div className="relative flex-shrink-0">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 sm:border-6 border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                                />
                                {isOnline ? (
                                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 border-2 sm:border-4 border-white rounded-full animate-pulse"></div>
                                ) : (
                                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 border-2 sm:border-4 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 text-center w-full mt-2 sm:mt-4">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2 px-2">
                                    {`${firstName} ${lastName}`}
                                </h1>
                                <p className="text-sm sm:text-md mb-1 sm:mb-1.5">
                                    <span className="text-gray-400">@</span>
                                    <span className="text-gray-800 font-medium">{userName}</span>
                                </p>

                                <div className='text-gray-700 font-medium min-h-auto sm:min-h-20 px-2'>
                                    {(gender || dateOfBirth) && (
                                        <div className='flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center text-sm sm:text-base'>
                                            {gender && <p className='mt-1 sm:mt-2 mb-1'>{gender}</p>}
                                            {gender && dateOfBirth && <span className='hidden sm:inline'>,</span>}
                                            {dateOfBirth && (
                                                <p className="flex items-center gap-1 mt-1 sm:mt-2 mb-1">
                                                    <Cake className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                                    {formatedDOB}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {about && (
                                        <p className="leading-relaxed whitespace-pre-line max-w-full sm:max-w-lg mt-2 mb-2 text-sm sm:text-base mx-auto px-2">
                                            {about}
                                        </p>
                                    )}
                                </div>

                                <div className='mt-3 sm:mt-2 min-h-auto sm:min-h-10'>
                                    {interests && interests.length > 0 && (
                                        <ul className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center px-2">
                                            {interests.map((interest, index) => (
                                                <li
                                                    className="bg-purple-100 text-purple-700 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full font-medium text-xs sm:text-sm"
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

                        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mt-4 sm:mt-6">
                            {isPremium && (
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-sm sm:text-xl">{`Connections (${pagination.totalConnections || 0})`}</span>
                                    {isLoadingConnections && (
                                        <Loader2 className="w-4 h-4 animate-spin text-purple-600 ml-2" />
                                    )}
                                </h3>
                            )}

                            {isPremium ? (
                                <>
                                    {isLoadingConnections ? (
                                        <ConnectionShimmer />
                                    ) : connectionList && connectionList.length > 0 ? (
                                        <div className="space-y-2 sm:space-y-3">
                                            {connectionList.map((connection, index) => {
                                                return (
                                                    <div
                                                        key={connection.connectionId}
                                                        className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-purple-200'
                                                        style={{
                                                            animation: `fadeInUp 0.3s ease-out forwards`,
                                                            animationDelay: `${index * 0.05}s`,
                                                            opacity: 0
                                                        }}
                                                    >
                                                        <div className='flex items-center gap-2 sm:gap-3'>
                                                            <div className="relative">
                                                                <img
                                                                    src={connection.user.profileImage}
                                                                    alt='Profile Pic'
                                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-700 text-sm sm:text-base">{`${connection.user.firstName} ${connection.user.lastName}`}</span>
                                                                <span className="text-xs sm:text-sm text-gray-500">{`@${connection.user.userName}`}</span>
                                                            </div>
                                                        </div>
                                                        {connection.user.location && (
                                                            <div className='text-xs sm:text-sm text-gray-500 ml-14 sm:ml-0 flex gap-2'>
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{connection.user.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 sm:py-8">
                                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                                            <p className="text-gray-500 font-medium text-sm sm:text-base">User doesn't have any connections.</p>
                                        </div>
                                    )}

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={pagination.totalPages}
                                        totalItems={pagination.totalConnections}
                                        itemsPerPage={pagination.limit}
                                        onPageChange={handlePageChange}
                                        hasNextPage={pagination.hasNextPage}
                                        hasPrevPage={pagination.hasPrevPage}
                                        showPageInfo={true}
                                        itemName="connections"
                                    />
                                </>
                            ) : (
                                <PremiumWarning />
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                            {location && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate max-w-[200px] sm:max-w-none">{location}</span>
                                </div>
                            )}
                            {createdAt && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <Calendar className="w-4 h-4" />
                                    Joined {joinDate}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                            {clickFrom === 'Feed' ? (
                                <>
                                    <button
                                        className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl text-sm sm:text-base"
                                        onClick={() => {
                                            onAction('ignored', user._id);
                                            onClose();
                                        }}
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl text-sm sm:text-base"
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
                                        className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-600 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl cursor-pointer text-sm sm:text-base"
                                        onClick={() => {
                                            onAction('accepted', requestId);
                                            onClose();
                                        }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="flex-1 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold shadow-lg transition-all hover:shadow-xl cursor-pointer text-sm sm:text-base"
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