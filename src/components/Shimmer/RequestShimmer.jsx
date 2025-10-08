import React from 'react'

const RequestShimmer = () => {
    return (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-5 bg-gray-300 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="space-y-2 mb-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="flex gap-4 mb-3">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:w-auto w-full">
                    <div className="h-10 bg-gray-300 rounded-xl w-20"></div>
                    <div className="h-10 bg-gray-200 rounded-xl w-20"></div>
                </div>
            </div>
        </div>
    );
}

export default RequestShimmer;