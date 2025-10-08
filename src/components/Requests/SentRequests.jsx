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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Inbox className="w-6 h-6" />
                Sent Requests
                <div className="ml-4 flex items-center gap-2">
                    <Loader className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="text-sm text-purple-600 font-normal">Loading...</span>
                </div>
            </h2>

            <div className="space-y-4">
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
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Send className="w-6 h-6" />
                        Sent Requests
                    </h2>

                    {sentRequestsList?.length === 0 ? (
                        <div className="text-center py-12">
                            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-500 mb-2">No sent requests</h3>
                            <p className="text-gray-400">Friend requests you send will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sentRequestsList?.map((request) => {
                                const calculateTimeDiff = getTimeAgo(request.createdAt);
                                const joinDate = formattedDate(request.toUserId.createdAt);
                                return (
                                    <div
                                        key={request._id}
                                        className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* User Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <img
                                                    src={request.toUserId.profileImage}
                                                    alt={request.toUserId.firstName + ' ' + request.toUserId.lastName}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-800">{request.toUserId.firstName + ' ' + request.toUserId.lastName}</h3>
                                                        <span className="text-gray-500 text-sm">{request.toUserId.userName}</span>
                                                        <span className="text-gray-400 text-sm">• {calculateTimeDiff}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{request.toUserId.about}</p>

                                                    {/* User Stats */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {request.toUserId.location}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            Joined {joinDate}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex flex-col gap-2 md:w-auto w-full">
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium text-center text-yellow-600 bg-yellow-100`}>
                                                    Pending
                                                </div>

                                                {request.status === 'interested' && (
                                                    <button
                                                        onClick={() => handleCancelRequest(request, request._id)}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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

export default SentRequests
