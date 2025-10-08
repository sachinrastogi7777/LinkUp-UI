import React, { useEffect, useState } from 'react'
import { formattedDate, getTimeAgo } from '../../utils/helper';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Check, Inbox, Loader, MapPin, X } from 'lucide-react';
import { addRequests } from '../../utils/slice/requestSlice';
import RequestShimmer from '../Shimmer/RequestShimmer';
import ProfileModal from '../Profile/ProfileModal';

const ReceivedRequests = ({ onLengthChange, isLoadingReceived = false, isPremium = false }) => {
    const dispatch = useDispatch();
    const requestReceivedListData = useSelector((store) => store.request);
    const [loadingRequestId, setLoadingRequestId] = useState(null);
    const [processingType, setProcessingType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestId, setRequestId] = useState(null);

    useEffect(() => {
        if (onLengthChange) onLengthChange(requestReceivedListData?.length);
    }, [requestReceivedListData, onLengthChange]);

    const reviewedRequests = async (status, requestId) => {
        try {
            if (status === 'accepted') {
                setLoadingRequestId(requestId);
                setProcessingType('accept');
            } else if (status === 'rejected') {
                setLoadingRequestId(requestId);
                setProcessingType('decline');
            }
            const response = await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`, {}, { withCredentials: true });
            if (response.data.data.status === 'accepted') {
                toast.success('Request accepted successfully!', {
                    position: 'top-center',
                    autoClose: 2000
                });
            }
            if (response.data.data.status === 'rejected') {
                toast.error('Request declined!', {
                    position: 'top-center',
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(addRequests(requestReceivedListData.filter(req => req._id !== requestId)));
            setLoadingRequestId(null);
            setProcessingType(null);
        }
    };

    const LoadingRequests = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Inbox className="w-6 h-6" />
                Received Requests
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
        <>
            <div>
                {isLoadingReceived && !requestReceivedListData?.length ? (
                    <LoadingRequests />
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Inbox className="w-6 h-6" />
                            Received Requests
                        </h2>

                        {requestReceivedListData?.length === 0 ? (
                            <div className="text-center py-12">
                                <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-500 mb-2">No received requests</h3>
                                <p className="text-gray-400">When people send you friend requests, they'll appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requestReceivedListData.map((request) => {
                                    const calculateTimeDiff = getTimeAgo(request.createdAt);
                                    const joinDate = formattedDate(request.fromUserId.createdAt);
                                    return (
                                        <div key={request._id} className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <img src={request.fromUserId.profileImage} alt={`${request.fromUserId.firstName} ${request.fromUserId.lastName}`} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg" />
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <h3 className="text-lg font-bold text-gray-800">{`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}</h3>
                                                            <span className="text-gray-500 text-sm">{request.fromUserId.username}</span>
                                                            <span className="text-gray-400 text-sm">• {calculateTimeDiff}</span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{request.fromUserId.about}</p>

                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                                            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{request.fromUserId.location}</div>
                                                            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {joinDate}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 md:w-auto w-full items-stretch">
                                                    <div className="flex flex-row gap-3 w-full">
                                                        {!(loadingRequestId === request._id && processingType === 'decline') && (
                                                            <button onClick={() => reviewedRequests('accepted', request._id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" disabled={loadingRequestId === request._id}>
                                                                {loadingRequestId === request._id && processingType === 'accept' ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                                {loadingRequestId === request._id && processingType === 'accept' ? 'Processing...' : 'Accept'}
                                                            </button>
                                                        )}

                                                        {!(loadingRequestId === request._id && processingType === 'accept') && (
                                                            <button onClick={() => reviewedRequests('rejected', request._id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" disabled={loadingRequestId === request._id}>
                                                                {loadingRequestId === request._id && processingType === 'decline' ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                                {loadingRequestId === request._id && processingType === 'decline' ? 'Processing...' : 'Decline'}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                        onClick={() => {
                                                            setSelectedUser(request.fromUserId);
                                                            setIsModalOpen(true);
                                                            setRequestId(request._id);
                                                        }}>
                                                        View Profile
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                    setRequestId(null);
                }}
                user={selectedUser || {}}
                isPremium={isPremium}
                onAction={reviewedRequests}
                clickFrom='Requests'
                requestId={requestId}
            />
        </>
    )
}

export default ReceivedRequests;