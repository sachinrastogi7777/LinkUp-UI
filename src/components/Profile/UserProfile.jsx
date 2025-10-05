import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formattedDate } from '../../utils/helper';
import { Cake, Calendar, MapPin, Pencil } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import ProfileShimmer from '../Shimmer/ProfileShimmer';

const UserProfile = () => {
    const userData = useSelector((store) => store.user);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
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
        dateOfBirth = ''
    } = userData || {};
    const formatedDOB = formattedDate(dateOfBirth);
    const joinDate = formattedDate(createdAt);

    useEffect(() => {
        // If userData is empty, fetch user profile and set in store
        if (!userData || Object.keys(userData).length === 0) {
            axios.get(BASE_URL + '/profile/', { withCredentials: true })
                .then(res => {
                    dispatch(addUser(res.data));
                    setIsProfileLoading(false);
                })
                .catch(err => {
                    console.log('Failed to fetch user profile:', err);
                    setIsProfileLoading(false);
                }).finally(() => {
                    setIsProfileLoading(false);
                });
        }
        else {
            setIsProfileLoading(false);
        }
    }, [])

    return (
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
        </div>
    )
}

export default UserProfile