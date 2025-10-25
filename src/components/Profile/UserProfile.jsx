import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formattedDate, getTimeAgo } from '../../utils/helper';
import { Cake, Calendar, Loader2, MapPin, MessageCircle, Pencil, Users } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import ProfileShimmer from '../Shimmer/ProfileShimmer';
import ConnectionShimmer from '../Shimmer/ConnectionShimmer';
import { Link, useNavigate } from 'react-router-dom';
import { addConnection } from '../../utils/slice/connectionSlice';
import ProfileModal from './ProfileModal';

const UserProfile = ({ isPremium = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);
    const connectionList = useSelector((store) => store.connection);
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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

    const userConnections = async () => {
        if (!_id) {
            setIsLoadingConnections(false);
            return;
        }
        try {
            setIsLoadingConnections(true);
            const response = await axios.get(`${BASE_URL}/user/connections/${_id}`, { withCredentials: true });
            if (response) {
                dispatch(addConnection(response.data.userConnection));
            }
            else {
                throw new Error('Failed to fetch the connections.')
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setIsLoadingConnections(false);
        }
    }

    useEffect(() => {
        setIsProfileLoading(false);
        if (_id) {
            userConnections();
        }
    }, [_id])

    return (
        <>
            <div className="relative z-10 max-w-6xl mx-auto p-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverImage})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="relative px-6 md:px-10 pb-8">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="btn btn-sm bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-full shadow-md transition duration-300"
                            >
                                <Pencil className='w-5 h-5' />
                                Edit Profile
                            </button>
                        </div>
                        {isProfileLoading ? (
                            <ProfileShimmer />
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 md:-mt-20">
                                <div className="relative">
                                    {profileImage && (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-6 border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    )}
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
                                                <p className="flex items-center gap-1 mt-2 mb-1"><Cake className='w-4 h-4' />{`${formatedDOB}`}</p>
                                            </span>
                                        )}
                                        {about &&
                                            <p className=" leading-relaxed whitespace-pre-line max-w-lg mt-1 mb-2">
                                                {about}
                                            </p>
                                        }
                                    </div>
                                    <div className='mt-2 min-h-10'>
                                        {interests && interests.length > 0 && (
                                            <ul className="flex flex-row flex-wrap gap-3">
                                                {interests.map((skill, index) => (
                                                    <li className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium" key={index}>{skill}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                {`Connections (${connectionList ? connectionList.length : 0})`}
                                {isLoadingConnections && (
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600 ml-2" />
                                )}
                            </h3>

                            {isLoadingConnections ? (
                                <ConnectionShimmer />
                            ) : (
                                <div className="space-y-3">
                                    {connectionList && connectionList.length > 0 ? (
                                        connectionList.map((connection) => {
                                            const calculateTimeDiff = getTimeAgo(connection.connectedAt);
                                            return (
                                                <div
                                                    key={connection.connectionId}
                                                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md opacity-0 animate-fadeInUp"
                                                    style={{
                                                        animation: `fadeInUp 0.5s ease-out forwards`,
                                                        animationDelay: `${connectionList.indexOf(connection) * 0.1}s`
                                                    }}
                                                >
                                                    {/* Desktop: Horizontal Layout */}
                                                    <div className="hidden md:flex items-center gap-4">
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                src={connection.user.profileImage}
                                                                alt='Profile Pic'
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                            {connection.user.isOnline ? (
                                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                            ) : (
                                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-shrink-0 w-40 lg:w-auto lg:flex lg:gap-4">
                                                            <div className="lg:w-40">
                                                                <span className="font-semibold text-gray-800 block truncate">
                                                                    {`${connection.user.firstName} ${connection.user.lastName}`}
                                                                </span>
                                                                <span className="font-medium text-gray-500 text-sm lg:hidden truncate block">
                                                                    {`@${connection.user.userName}`}
                                                                </span>
                                                            </div>
                                                            <div className="hidden lg:block lg:w-32">
                                                                <span className="font-medium text-gray-500 text-sm truncate block">
                                                                    {`@${connection.user.userName}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0 w-32 lg:w-40">
                                                            <span className="font-medium text-gray-500 text-xs lg:text-sm truncate block">
                                                                {`Connected ${calculateTimeDiff}`}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1"></div>

                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <button
                                                                className="px-3 lg:px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition font-semibold cursor-pointer text-xs lg:text-sm whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedUser(connection.user);
                                                                    setIsModalOpen(true);
                                                                }}
                                                            >
                                                                View Profile
                                                            </button>
                                                            <button
                                                                className="px-3 lg:px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition font-semibold border border-gray-300 cursor-pointer text-xs lg:text-sm whitespace-nowrap"
                                                                onClick={() => handleRemove(connection.user.userName)}
                                                            >
                                                                Remove
                                                            </button>
                                                            <Link to={`/chat/${connection.user._id}`} state={{ user: connection.user }}>
                                                                <button
                                                                    className="px-3 lg:px-4 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 transition font-semibold flex items-center gap-1 lg:gap-2 cursor-pointer text-xs lg:text-sm whitespace-nowrap"
                                                                >
                                                                    <MessageCircle size={16} />
                                                                    <span className="hidden lg:inline">Chat</span>
                                                                    <span className="lg:hidden">Chat</span>
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* Mobile: Stacked Layout */}
                                                    <div className="md:hidden">
                                                        <div className='flex items-center gap-3 mb-3'>
                                                            <div className="relative flex-shrink-0">
                                                                <img
                                                                    src={connection.user.profileImage}
                                                                    alt='Profile Pic'
                                                                    className="w-12 h-12 rounded-full object-cover"
                                                                />
                                                                {connection.user.isOnline ? (
                                                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                                                ) : (
                                                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 border-2 border-white rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                                                <div className="flex flex-col gap-1 min-w-0">
                                                                    <span className="font-semibold text-gray-800 truncate">
                                                                        {`${connection.user.firstName} ${connection.user.lastName}`}
                                                                    </span>
                                                                    <span className="font-medium text-gray-500 text-sm truncate">
                                                                        {`@${connection.user.userName}`}
                                                                    </span>
                                                                </div>
                                                                <span className='font-medium text-gray-500 text-sm whitespace-nowrap ml-auto'>
                                                                    {`Connected ${calculateTimeDiff}`}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition font-semibold cursor-pointer text-sm whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedUser(connection.user);
                                                                    setIsModalOpen(true);
                                                                }}
                                                            >
                                                                View Profile
                                                            </button>
                                                            <button
                                                                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition font-semibold border border-gray-300 cursor-pointer text-sm whitespace-nowrap"
                                                                onClick={() => handleRemove(connection.user.userName)}
                                                            >
                                                                Remove
                                                            </button>
                                                            <Link to={`/chat/${connection.user._id}`} state={{ user: connection.user }}>
                                                                <button
                                                                    className="w-full sm:w-auto px-4 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
                                                                >
                                                                    <MessageCircle size={16} />
                                                                    Chat
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">No connections found</p>
                                            <Link to='/' className="text-gray-400 text-sm hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent transition-colors">
                                                Start connecting with other users!
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {location}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                Joined {joinDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser || {}}
                isPremium={isPremium}
            />
        </>
    )
}

export default UserProfile