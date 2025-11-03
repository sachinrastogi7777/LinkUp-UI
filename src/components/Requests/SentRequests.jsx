import React, { useEffect, useState } from 'react'
import { Calendar, Inbox, Loader, MapPin, Send, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { formattedDate, getTimeAgo } from '../../utils/helper';
import RequestShimmer from '../Shimmer/RequestShimmer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/constants';
import { addSentRequests } from '../../utils/slice/sentRequestSlice';
import { addUserInFeed } from '../../utils/slice/feedSlice';

const SentRequests = (props) => {
    const dispatch = useDispatch();
    const sentRequestsList = useSelector((store) => store.sentRequest);
    const [loadingRequestId, setLoadingRequestId] = useState(null);
    const { onLengthChange } = props;

    const deleteRequest = async (requestId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/request/delete/${requestId}`, { withCredentials: true });
            if (response.status === 200) {
                toast.error('Request deleted successfully!', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                });
            }
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    }

    const handleCancelRequest = (user, requestId) => {
        setLoadingRequestId(requestId);
        deleteRequest(requestId).finally(() => {
            dispatch(addSentRequests(sentRequestsList.filter(req => req._id !== requestId)));
            dispatch(addUserInFeed(user.toUserId));
            setLoadingRequestId(null);
        })
    };

    useEffect(() => {
        if (onLengthChange) {
            onLengthChange(sentRequestsList?.length);
        }
    }, [sentRequestsList, onLengthChange]);

    // Loading Component
    const LoadingRequests = () => (
        <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Inbox className="w-5 h-5 sm:w-6 sm:h-6" />
                Sent Requests
                <div className="ml-2 sm:ml-4 flex items-center gap-2">
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-spin" />
                    <span className="text-xs sm:text-sm text-purple-600 font-normal">Loading...</span>
                </div>
            </h2>

            <div className="space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, index) => (
                    <RequestShimmer key={index} />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {props.isLoadingSent && !sentRequestsList?.length ? (
                <LoadingRequests />
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                        Sent Requests
                    </h2>

                    {sentRequestsList?.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <Send className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-500 mb-1 sm:mb-2">No sent requests</h3>
                            <p className="text-sm sm:text-base text-gray-400">Friend requests you send will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {sentRequestsList?.map((request) => {
                                const calculateTimeDiff = getTimeAgo(request.createdAt);
                                const joinDate = formattedDate(request.toUserId.createdAt);
                                return (
                                    <div
                                        key={request._id}
                                        className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-lg border border-gray-100"
                                    >
                                        <div className="flex md:hidden flex-col gap-3 sm:gap-4">
                                            <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
                                                <img
                                                    src={request.toUserId.profileImage}
                                                    alt={request.toUserId.firstName + ' ' + request.toUserId.lastName}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white shadow-lg flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 lg:gap-2 mb-1 sm:mb-2">
                                                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate">{request.toUserId.firstName + ' ' + request.toUserId.lastName}</h3>
                                                        <span className="text-xs sm:text-sm text-gray-500 truncate font-medium">{`@${request.toUserId.userName}`}</span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">• {calculateTimeDiff}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2 sm:mb-3">{request.toUserId.about}</p>

                                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                            <span className="truncate">{request.toUserId.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                            <span className="truncate">Joined {joinDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col xs:flex-row gap-2 sm:gap-2.5">
                                                <div className="px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-center text-yellow-600 bg-yellow-100 xs:flex-shrink-0">
                                                    Pending
                                                </div>

                                                {request.status === 'interested' && (
                                                    <button
                                                        onClick={() => handleCancelRequest(request, request._id)}
                                                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-red-200 text-red-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-1 xs:flex-initial"
                                                        disabled={loadingRequestId === request._id}
                                                    >
                                                        {loadingRequestId === request._id ? (
                                                            <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                                        ) : (
                                                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        )}
                                                        {loadingRequestId === request._id ? 'Processing...' : 'Cancel'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tablet & Desktop Layout: Buttons on Right */}
                                        <div className="hidden md:flex items-start gap-4">
                                            <img
                                                src={request.toUserId.profileImage}
                                                alt={request.toUserId.firstName + ' ' + request.toUserId.lastName}
                                                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white shadow-lg flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-2">
                                                    <h3 className="text-base lg:text-lg font-bold text-gray-800 truncate">{request.toUserId.firstName + ' ' + request.toUserId.lastName}</h3>
                                                    <span className="text-sm text-gray-500 truncate font-medium">{`@${request.toUserId.userName}`}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-2">• {calculateTimeDiff}</p>
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">{request.toUserId.about}</p>

                                                <div className="flex flex-wrap gap-3 lg:gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">{request.toUserId.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">Joined {joinDate}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Buttons Column - Right Aligned */}
                                            <div className="flex flex-col gap-2.5 items-end flex-shrink-0">
                                                <div className="px-4 py-2 rounded-full text-sm font-medium text-yellow-600 bg-yellow-100 min-w-[120px] text-center">
                                                    Pending
                                                </div>

                                                {request.status === 'interested' && (
                                                    <button
                                                        onClick={() => handleCancelRequest(request, request._id)}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 min-w-[120px]"
                                                        disabled={loadingRequestId === request._id}
                                                    >
                                                        {loadingRequestId === request._id ? (
                                                            <Loader className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <X className="w-4 h-4" />
                                                        )}
                                                        {loadingRequestId === request._id ? 'Processing...' : 'Cancel'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SentRequests;