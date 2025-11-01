import React, { useEffect, useState } from 'react'
import { Inbox, Send } from 'lucide-react'
import ReceivedRequests from './ReceivedRequests'
import SentRequests from './SentRequests'
import { useSelector } from 'react-redux'

const Requests = () => {
    const [activeTab, setActiveTab] = useState('received');
    const receivedRequestsList = useSelector((store) => store.request);
    const sentRequestsList = useSelector((store) => store.sentRequest);
    const [receivedRequestsLength, setReceivedRequestsLength] = useState(receivedRequestsList?.length || 0);
    const [sentRequestsLength, setSentRequestsLength] = useState(sentRequestsList?.length || 0);
    const [isLoadingReceived, setIsLoadingReceived] = useState(true);
    const [isLoadingSent, setIsLoadingSent] = useState(true);

    useEffect(() => {
        if (sentRequestsList && sentRequestsList.length >= 0) {
            setIsLoadingSent(false);
            setSentRequestsLength(sentRequestsList?.length || 0);
        }
    }, [sentRequestsList]);

    useEffect(() => {
        if (receivedRequestsList && receivedRequestsList.length >= 0) {
            setIsLoadingReceived(false);
            setReceivedRequestsLength(receivedRequestsList.length);
        }
    }, [receivedRequestsList]);

    return (
        <div className="relative z-10 w-full px-3 sm:px-4 lg:px-6 max-w-4xl mx-auto mt-4 sm:mt-6 lg:mt-8 pb-6">
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-6 lg:p-8">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                        Friend Requests
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage your connection requests</p>
                </div>

                <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
                    <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 flex w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 flex-1 sm:flex-initial ${activeTab === 'received'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-purple-600'
                                }`}
                        >
                            <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Received</span>
                            <span className="ml-0.5">({receivedRequestsLength})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 flex-1 sm:flex-initial ${activeTab === 'sent'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-purple-600'
                                }`}
                        >
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Sent</span>
                            <span className="ml-0.5">({sentRequestsLength})</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
                {activeTab === 'received' && (
                    <ReceivedRequests
                        onLengthChange={(len) => setReceivedRequestsLength(len)}
                        receivedRequests={receivedRequestsList}
                        isLoadingReceived={isLoadingReceived}
                    />
                )}

                {activeTab === 'sent' && (
                    <SentRequests
                        onLengthChange={(len) => setSentRequestsLength(len)}
                        sentRequestsData={sentRequestsList}
                        isLoadingSent={isLoadingSent}
                    />
                )}
            </div>
        </div>
    )
}

export default Requests;