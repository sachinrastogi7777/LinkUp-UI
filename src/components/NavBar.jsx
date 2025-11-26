import React, { useMemo } from 'react'
import logo from '../assets/linkup-logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/slice/userSlice';
import { removeConnection } from '../utils/slice/connectionSlice';
import { removeRequest } from '../utils/slice/requestSlice';
import { removeSentRequest } from '../utils/slice/sentRequestSlice';
import { removeFeed } from '../utils/slice/feedSlice';
import { MessageCircle, LogIn, UserPlus } from 'lucide-react';

const NavBar = ({ totalRequests }) => {
    const userData = useSelector((store) => store.user);
    const chatsList = useSelector((store) => store?.chats?.chats || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    const totalUnreadChats = useMemo(() => {
        return chatsList.filter(chat => chat.unreadCount > 0).length;
    }, [chatsList]);

    const handleLogOut = async () => {
        try {
            await axios.post(BASE_URL + '/logout', {}, { withCredentials: true });
            localStorage.setItem('manualLogout', 'true');
            dispatch(removeUser());
            dispatch(removeConnection());
            dispatch(removeRequest());
            dispatch(removeSentRequest());
            dispatch(removeFeed());
            localStorage.removeItem('requestState');
            navigate('/login');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="navbar bg-gradient-to-bl from-gray-900 via-purple-900 to-pink-900 shadow-sm px-3 sm:px-4 h-16">
            <div className="flex-none">
                <Link to='/'>
                    <img
                        src={logo}
                        alt="LinkUp Logo"
                        className="h-10 w-20 sm:h-12 sm:w-24"
                    />
                </Link>
            </div>

            {!userData && currentPath === '/' && (
                <div className="flex gap-2 sm:gap-3 items-center ml-auto">
                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 font-medium text-sm border border-white border-opacity-20 backdrop-blur-sm"
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="xs:hidden xs:inline">Login</span>
                    </Link>
                    <Link
                        to="/signup"
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="xd:hidden xs:inline">Sign Up</span>
                    </Link>
                </div>
            )}

            {userData && (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:flex gap-3 lg:gap-5 items-center ml-auto">
                        {currentPath !== '/requests' && (
                            <button
                                onClick={() => navigate('/requests')}
                                className='relative px-4 py-2 bg-blue-200 text-blue-800 rounded-full shadow hover:bg-blue-300 transition font-semibold flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer'
                            >
                                Requests
                                {totalRequests > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg">
                                        {totalRequests}
                                    </span>
                                )}
                            </button>
                        )}
                        {currentPath !== '/chats' && (
                            <button
                                onClick={() => navigate('/chats')}
                                className="relative px-4 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat
                                {totalUnreadChats > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg">
                                        {totalUnreadChats}
                                    </span>
                                )}
                            </button>
                        )}
                        <div className='flex items-center gap-2'>
                            <p className='text-white text-sm lg:text-base hidden lg:block'>
                                {`Welcome, ${userData.firstName}`}
                            </p>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-8 lg:w-10 rounded-full">
                                        <img
                                            alt="user-profile-pic"
                                            src={userData.profileImage}
                                        />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow"
                                >
                                    <li>
                                        <Link to='/profile' className="justify-between">
                                            Profile
                                        </Link>
                                    </li>
                                    <li><a>Settings</a></li>
                                    <li onClick={handleLogOut}><Link>Logout</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="flex md:hidden items-center gap-2 ml-auto">
                        {currentPath !== '/requests' && (
                            <button
                                onClick={() => navigate('/requests')}
                                className="relative px-4 py-2 bg-blue-200 text-blue-800 rounded-full shadow hover:bg-blue-300 transition font-semibold flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer"
                            >
                                Requests
                                {totalRequests > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                                        {totalRequests}
                                    </span>
                                )}
                            </button>
                        )}

                        {currentPath !== '/chats' && (
                            <button
                                className="relative px-4 py-2 bg-green-100 text-green-800 rounded-full shadow hover:bg-green-200 transition font-semibold flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer"
                                onClick={() => navigate('/chats')}
                            >
                                <MessageCircle className="w-4 h-4" />
                                {totalUnreadChats > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                                        {totalUnreadChats}
                                    </span>
                                )}
                            </button>
                        )}

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full ring-2 ring-purple-400">
                                    <img
                                        alt="user-profile-pic"
                                        src={userData.profileImage}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-35 p-2 shadow-lg"
                            >
                                <li className="menu-title">
                                    <span className="text-xs">Welcome, {userData.firstName}!</span>
                                </li>
                                <li>
                                    <Link to='/profile' className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                                <li><a>Settings</a></li>
                                <li onClick={handleLogOut}><Link>Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default NavBar;