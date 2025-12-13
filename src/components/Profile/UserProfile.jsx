import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Cake, Calendar, Loader, Loader2, MapPin, MessageCircle, Pencil, Trash2, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { formattedDate, getTimeAgo } from '../../utils/helper';
import { BASE_URL } from '../../utils/constants';
import ProfileShimmer from '../Shimmer/ProfileShimmer';
import ConnectionShimmer from '../Shimmer/ConnectionShimmer';
import { addConnection } from '../../utils/slice/connectionSlice';
import { addUserInFeed } from '../../utils/slice/feedSlice';
import ProfileModal from './ProfileModal';
import MutualConnectionsModal from './MutualConnectionModal';
import Pagination from './Pagination';

const UserProfile = ({ isPremium = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);
    const connectionList = useSelector((store) => store.connection);
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingRequestId, setLoadingRequestId] = useState(null);
    const [mutualConnectionsMap, setMutualConnectionsMap] = useState({});
    const [loadingMutualConnections, setLoadingMutualConnections] = useState(false);
    const [isMutualModalOpen, setIsMutualModalOpen] = useState(false);
    const [selectedUserForMutual, setSelectedUserForMutual] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalConnections: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 5
    });

    const {
        firstName = '',
        lastName = '',
        about = '',
        profileImage = '',
        coverImage = '',
        userName = '',
        location = '',
        createdAt = '',
        interests = [],
        gender = '',
        dateOfBirth = '',
        _id = ''
    } = userData || {};
    const formatedDOB = formattedDate(dateOfBirth);
    const joinDate = formattedDate(createdAt);

    const userConnections = async (page = 1) => {
        if (!_id) {
            setIsLoadingConnections(false);
            return;
        }
        try {
            setIsLoadingConnections(true);
            const response = await axios.get(
                `${BASE_URL}/user/connections/${_id}?page=${page}&limit=5`,
                { withCredentials: true }
            );
            if (response) {
                dispatch(addConnection(response.data.userConnection));
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                throw new Error('Failed to fetch the connections.')
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoadingConnections(false);
        }
    };

    // Fetch mutual connections for ALL connections.
    const fetchMutualConnections = async () => {
        if (!connectionList || connectionList.length === 0) return;
        try {
            setLoadingMutualConnections(true);
            const userIds = connectionList.map(connection => connection.user._id);
            const response = await axios.post(
                `${BASE_URL}/user/mutualConnections/batch`,
                { userIds },
                { withCredentials: true }
            );
            if (response.data && response.data.mutualConnections) {
                setMutualConnectionsMap(response.data.mutualConnections);
            }
        } catch (error) {
            console.error('Error fetching mutual connections:', error);
            const emptyMap = {};
            connectionList.forEach(connection => {
                emptyMap[connection.user._id] = 0;
            });
            setMutualConnectionsMap(emptyMap);
        } finally {
            setLoadingMutualConnections(false);
        }
    };

    const removeConnection = async (connectionId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/removeConnection/${connectionId}`, { withCredentials: true });
            if (response.status === 200) {
                toast.error('Connection removed successfully!', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                });
            }
        } catch (error) {
            console.error('Error removing connection:', error);
        }
    };

    useEffect(() => {
        setIsProfileLoading(false);
        if (_id) {
            userConnections(currentPage);
        }
    }, [_id, currentPage]);

    useEffect(() => {
        if (connectionList && connectionList.length > 0 && !isLoadingConnections) {
            fetchMutualConnections();
        }
    }, [connectionList, isLoadingConnections]);

    const handleRemoveConnection = (user, requestId) => {
        setLoadingRequestId(requestId);
        removeConnection(requestId).finally(() => {
            const updatedList = connectionList.filter(req => req.connectionId !== requestId);
            dispatch(addConnection(updatedList));
            dispatch(addUserInFeed(user.user));
            setLoadingRequestId(null);

            if (updatedList.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                userConnections(currentPage);
            }
        })
    };

    const handleMutualConnectionClick = (e, user) => {
        e.stopPropagation();
        setSelectedUserForMutual(user);
        setIsMutualModalOpen(true);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <div className="relative z-10 w-full px-3 sm:px-4 lg:px-6 max-w-6xl mx-auto mt-4 sm:mt-6 pb-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mb-6 sm:mb-8 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
                    <div className="relative h-32 sm:h-40 md:h-48 lg:h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverImage})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="btn btn-sm bg-pink-600 hover:bg-pink-700 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md transition duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                            >
                                <Pencil className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                <span className="hidden sm:inline">Edit Profile</span>
                                <span className="sm:hidden">Edit</span>
                            </button>
                        </div>
                    </div>
                    <div className="relative px-4 sm:px-6 md:px-10 pb-6 sm:pb-8">
                        {isProfileLoading ? (
                            <ProfileShimmer />
                        ) : (
                            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4 sm:gap-6 -mt-12 sm:-mt-16 md:-mt-20">
                                <div className="relative flex-shrink-0">
                                    {profileImage && (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-4 sm:border-6 border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 border-2 sm:border-4 border-white rounded-full animate-pulse"></div>
                                </div>

                                <div className="flex-1 sm:ml-4 md:ml-6 mt-2 sm:mt-4 md:mt-0">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                        {`${firstName} ${lastName}`}
                                    </h1>
                                    <p className="text-sm sm:text-base mb-1.5">
                                        <span className="text-gray-400">@</span>
                                        <span className="text-gray-800 font-medium">{userName}</span>
                                    </p>

                                    <div className='text-gray-700 font-medium min-h-16 sm:min-h-20'>
                                        {(gender || dateOfBirth) && (
                                            <div className='flex flex-wrap justify-center sm:justify-start gap-2 text-sm sm:text-base'>
                                                {gender && <p className='leading-relaxed whitespace-pre-line mt-2 mb-1'>{`${gender},`}</p>}
                                                {dateOfBirth && <p className="flex items-center gap-1 mt-2 mb-1">
                                                    <Cake className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                                    {`${formatedDOB}`}
                                                </p>}
                                            </div>
                                        )}
                                        {about && (
                                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-lg mt-1 mb-2">
                                                {about}
                                            </p>
                                        )}
                                    </div>

                                    <div className='mt-2 min-h-8 sm:min-h-10'>
                                        {interests && interests.length > 0 && (
                                            <ul className="flex flex-row flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                                                {interests.map((skill, index) => (
                                                    <li className="bg-purple-100 text-purple-700 px-2.5 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm" key={index}>
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 mt-4 sm:mt-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base lg:text-lg">{`Connections (${pagination.totalConnections})`}</span>
                                {(isLoadingConnections || loadingMutualConnections) && (
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600 ml-2" />
                                )}
                            </h3>

                            {isLoadingConnections ? (
                                <ConnectionShimmer />
                            ) : (
                                <>
                                    <div className="space-y-3 sm:space-y-4">
                                        {connectionList && connectionList.length > 0 ? (
                                            connectionList.map((connection) => {
                                                const calculateTimeDiff = getTimeAgo(connection.connectedAt);
                                                const unreadCount = connection.unreadCount || 0;
                                                const mutualCount = mutualConnectionsMap[connection.user._id] || 0;
                                                return (
                                                    <div
                                                        key={connection.connectionId}
                                                        className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-gray-100 transition-all duration-200 hover:shadow-md opacity-0 animate-fadeInUp"
                                                        style={{
                                                            animation: `fadeInUp 0.5s ease-out forwards`,
                                                            animationDelay: `${connectionList.indexOf(connection) * 0.1}s`
                                                        }}
                                                    >
                                                        {/* Mobile Layout */}
                                                        <div className="flex flex-col gap-3 sm:hidden">
                                                            <div className='flex items-start gap-2.5'>
                                                                <div className="relative flex-shrink-0">
                                                                    <img
                                                                        src={connection.user.profileImage}
                                                                        alt='Profile Pic'
                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                    />
                                                                    {connection.user.isOnline ? (
                                                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                                                                    ) : (
                                                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full"></div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <span className="font-semibold text-gray-800 text-sm block truncate">
                                                                        {`${connection.user.firstName} ${connection.user.lastName}`}
                                                                    </span>
                                                                    <span className="font-medium text-gray-500 text-sm block truncate">
                                                                        {`@${connection.user.userName}`}
                                                                    </span>
                                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                                        <span className='font-medium text-gray-500 text-xs'>
                                                                            {`Connected ${calculateTimeDiff}`}
                                                                        </span>
                                                                        {mutualCount > 0 && (
                                                                            <button
                                                                                onClick={(e) => handleMutualConnectionClick(e, connection.user)}
                                                                                className='font-medium text-purple-600 text-xs flex items-center gap-1 hover:text-purple-700 transition-colors cursor-pointer'
                                                                            >
                                                                                <Users className="w-3 h-3" />
                                                                                {`${mutualCount} mutual connection${mutualCount > 1 ? 's' : ''}`}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <button
                                                                    className="w-full px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold text-xs"
                                                                    onClick={() => {
                                                                        setSelectedUser(connection.user);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                >
                                                                    View Profile
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveConnection(connection, connection.connectionId)}
                                                                    className="w-full px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition font-semibold border border-gray-300 text-xs flex items-center justify-center gap-1.5"
                                                                    disabled={loadingRequestId === connection.connectionId}
                                                                >
                                                                    {loadingRequestId === connection.connectionId ? (
                                                                        <>
                                                                            <Loader className="w-3.5 h-3.5 animate-spin" />
                                                                            <span>Processing...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                            Remove
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <Link to={`/chat/${connection.user._id}`} state={{ user: connection.user }} className="w-full">
                                                                    <button
                                                                        className="relative w-full px-3 py-1.5 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-1.5 text-xs"
                                                                    >
                                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                                        Chat
                                                                        {unreadCount > 0 && (
                                                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                                                                {unreadCount > 99 ? '99+' : unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Tablet Layout */}
                                                        <div className="hidden sm:flex lg:hidden flex-col gap-3">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                                    <div className="relative">
                                                                        <img
                                                                            src={connection.user.profileImage}
                                                                            alt='Profile Pic'
                                                                            className="w-14 h-14 rounded-full object-cover"
                                                                        />
                                                                        {connection.user.isOnline ? (
                                                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                                        ) : (
                                                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
                                                                        )}
                                                                    </div>

                                                                    <div className="min-w-0">
                                                                        <span className="font-semibold text-gray-800 text-base block truncate">
                                                                            {`${connection.user.firstName} ${connection.user.lastName}`}
                                                                        </span>
                                                                        <span className="font-medium text-gray-500 text-sm block truncate">
                                                                            {`@${connection.user.userName}`}
                                                                        </span>
                                                                        {mutualCount > 0 && (
                                                                            <button
                                                                                onClick={(e) => handleMutualConnectionClick(e, connection.user)}
                                                                                className='font-medium text-purple-600 text-xs flex items-center gap-1 mt-0.5 hover:text-purple-700 transition-colors cursor-pointer'
                                                                            >
                                                                                <Users className="w-3 h-3" />
                                                                                {`${mutualCount} mutual`}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <span className='text-gray-500 text-sm whitespace-nowrap flex-shrink-0'>
                                                                    {`Connected ${calculateTimeDiff}`}
                                                                </span>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <button
                                                                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold text-xs whitespace-nowrap"
                                                                    onClick={() => {
                                                                        setSelectedUser(connection.user);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                >
                                                                    View Profile
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveConnection(connection, connection.connectionId)}
                                                                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition font-semibold border border-gray-300 text-xs flex items-center justify-center gap-1.5"
                                                                    disabled={loadingRequestId === connection.connectionId}
                                                                >
                                                                    {loadingRequestId === connection.connectionId ? (
                                                                        <>
                                                                            <Loader className="w-3.5 h-3.5 animate-spin" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                            Remove
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <Link to={`/chat/${connection.user._id}`} state={{ user: connection.user }} className="flex-1">
                                                                    <button
                                                                        className="relative w-full px-3 py-2 bg-green-100 text-green-800 rounded-lg shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-1.5 text-xs whitespace-nowrap"
                                                                    >
                                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                                        Chat
                                                                        {unreadCount > 0 && (
                                                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                                                                {unreadCount > 99 ? '99+' : unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Desktop Layout */}
                                                        <div className="hidden lg:flex items-center gap-4">
                                                            <div className="relative flex-shrink-0">
                                                                <img
                                                                    src={connection.user.profileImage}
                                                                    alt='Profile Pic'
                                                                    className="w-14 h-14 rounded-full object-cover"
                                                                />
                                                                {connection.user.isOnline ? (
                                                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                                ) : (
                                                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col min-w-0 flex-shrink-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-gray-800 text-base whitespace-nowrap">
                                                                        {`${connection.user.firstName} ${connection.user.lastName}`}
                                                                    </span>
                                                                    <span className="font-medium text-gray-500 text-sm whitespace-nowrap">
                                                                        {`@${connection.user.userName}`}
                                                                    </span>
                                                                </div>
                                                                {mutualCount > 0 && (
                                                                    <button
                                                                        onClick={(e) => handleMutualConnectionClick(e, connection.user)}
                                                                        className='font-medium text-purple-600 text-xs flex items-center gap-1 mt-0.5 hover:text-purple-700 transition-colors cursor-pointer'
                                                                    >
                                                                        <Users className="w-3 h-3" />
                                                                        {`${mutualCount} mutual connection${mutualCount > 1 ? 's' : ''}`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <span className='text-gray-500 text-sm whitespace-nowrap flex-shrink-0 ml-auto'>
                                                                {`Connected ${calculateTimeDiff}`}
                                                            </span>

                                                            <div className="flex gap-2.5 flex-shrink-0 ml-auto">
                                                                <button
                                                                    className="px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition font-semibold text-sm whitespace-nowrap cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedUser(connection.user);
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                >
                                                                    View Profile
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveConnection(connection, connection.connectionId)}
                                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition font-semibold border border-gray-300 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                                                    disabled={loadingRequestId === connection.connectionId}
                                                                >
                                                                    {loadingRequestId === connection.connectionId ? (
                                                                        <>
                                                                            <Loader className="w-4 h-4 animate-spin" />
                                                                            <span>Processing...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Trash2 className="w-4 h-4" />
                                                                            Remove
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <Link to={`/chat/${connection.user._id}`} state={{ user: connection.user }}>
                                                                    <button
                                                                        className="relative px-4 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        Chat
                                                                        {unreadCount > 0 && (
                                                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                                                                {unreadCount > 99 ? '99+' : unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-6 sm:py-8">
                                                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 font-medium text-sm sm:text-base">No connections found</p>
                                                <Link to='/' className="text-gray-400 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent transition-colors">
                                                    Start connecting with other users!
                                                </Link>
                                            </div>
                                        )}
                                    </div>

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
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                            {location && <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 text-sm sm:text-base">
                                <MapPin className="w-4 h-4" />
                                {location}
                            </div>}
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 text-sm sm:text-base">
                                <Calendar className="w-4 h-4" />
                                Joined {joinDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser || {}}
                isPremium={isPremium}
            />
            <MutualConnectionsModal
                isOpen={isMutualModalOpen}
                onClose={() => {
                    setIsMutualModalOpen(false);
                    setSelectedUserForMutual(null);
                }}
                targetUser={selectedUserForMutual}
                isPremium={isPremium}
            />
        </>
    )
}

export default UserProfile;