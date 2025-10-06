import React from 'react'

const ConnectionShimmer = () => {
    return (
        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>

            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                            {/* Avatar shimmer */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                            <div className="flex flex-col gap-2">
                                {/* Name shimmer */}
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                                {/* Username shimmer */}
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                        {/* Connected Since shimmer */}
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ConnectionShimmer;