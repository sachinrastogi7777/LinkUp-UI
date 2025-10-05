import React from 'react'

const ProfileShimmer = () => {
    return (
        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 overflow-hidden animate-pulse">
            {/* Cover Image Shimmer */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

            <div className="relative px-6 md:px-10 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 md:-mt-20">
                    {/* Avatar Shimmer */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer border-6 border-white shadow-xl"></div>
                    </div>

                    {/* User Info Shimmer */}
                    <div className="flex-1 text-center md:text-left md:ml-6 mt-4 md:mt-0 w-full">
                        <div className="h-10 bg-gray-300 rounded-lg w-3/4 md:w-1/2 mb-3 mx-auto md:mx-0"></div>
                        <div className="h-6 bg-gray-200 rounded-lg w-1/2 md:w-1/3 mb-4 mx-auto md:mx-0"></div>

                        {/* Gender and DOB Shimmer */}
                        <div className="flex gap-4 justify-center md:justify-start mb-3">
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>

                        {/* Bio Shimmer */}
                        <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gray-200 rounded w-full max-w-lg mx-auto md:mx-0"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 max-w-lg mx-auto md:mx-0"></div>
                        </div>

                        {/* Interests Shimmer */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileShimmer
